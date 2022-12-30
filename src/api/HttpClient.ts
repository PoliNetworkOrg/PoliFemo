import { EventEmitter } from "events"
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios"
import { RetryType } from "./RetryType"
import { PolimiToken, PoliNetworkToken, Tokens } from "utils/login"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"
import { wait } from "utils/functions"

/*Docs used to make this:
Singleton:
https://levelup.gitconnected.com/use-case-of-singleton-with-axios-and-typescript-da564e76296

Error retrying:
https://stackblitz.com/edit/retry-api-call-axios-interceptor?file=index.ts
*/

//in this way we can add fields to AxiosRequestConfig for more control in case of errors
declare module "axios" {
    export interface AxiosRequestConfig {
        retryType?: RetryType
        maxRetries?: number
        waitingTime?: number //seconds
        readonly retryCount?: number
        authType?: AuthType
    }
}

/**
 * Singleton object which manages requests and retries
 * to PoliNetwork Server and Polimi Server.
 *
 * Do not retrieve the instance of HttpClient in order to make a request,
 * instead, check {@link poliNetworkApi} for calls to PoliNetwork Server
 * and {@link authApi} for calls concerning authentication
 *
 *
 */
export declare interface HttpClient {
    /**
     * fired when login status changes, either because of a login or a logout
     * */
    on(event: "login_event", listener: (loggedIn: boolean) => void): this
    /**
     * fired when tokens are retrieved and user logs in
     */
    on(event: "login", listener: () => void): this
    /**
     * fired when tokens get destroyed and user logs out
     */
    on(event: "logout", listener: () => void): this
}
export class HttpClient extends EventEmitter {
    private static classInstance?: HttpClient

    readonly polimiInstance: AxiosInstance
    readonly poliNetworkInstance: AxiosInstance

    polimiToken?: PolimiToken
    poliNetworkToken?: PoliNetworkToken

    // TODO: await for token to refresh before sending multiple requests

    /**
     * retrieves singleton instance.
     *
     * @example
     * ```
     * const mainApi = MainApi.getInstance()
     * ```
     * */
    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new HttpClient(
                "https://api.polinetwork.org:446/",
                "https://polimiapp.polimi.it/polimi_app/rest/jaf"
            )
        }

        return this.classInstance
    }

    private constructor(baseUrlPoliNetwork: string, baseUrlPolimi: string) {
        super()
        console.log("HttpClient constructor called")
        this.poliNetworkInstance = axios.create({
            baseURL: baseUrlPoliNetwork,
            timeout: 2000,
        })
        this.polimiInstance = axios.create({
            baseURL: baseUrlPolimi,
            timeout: 2000,
        })
        this._initializeInterceptors()
    }

    /**
     * initialize interceptors functions
     * */
    private _initializeInterceptors = () => {
        this.poliNetworkInstance.interceptors.request.use(this._handleRequest)
        this.poliNetworkInstance.interceptors.response.use(
            val => this._handleResponse(val),
            err =>
                this._handleError(err as AxiosError, this.poliNetworkInstance)
        )
        this.polimiInstance.interceptors.request.use(this._handleRequest)
        this.polimiInstance.interceptors.response.use(
            val => this._handleResponse(val),
            err => this._handleError(err as AxiosError, this.polimiInstance)
        )
    }

    private _handleRequest = (config: AxiosRequestConfig) => {
        config.headers = config.headers ?? {}
        if (config.authType === AuthType.POLIMI && this.polimiToken) {
            config.headers[
                "Authorization"
            ] = `Bearer ${this.polimiToken.accessToken}`
        } else if (
            config.authType === AuthType.POLINETWORK &&
            this.poliNetworkToken
        ) {
            config.headers[
                "Authorization"
            ] = `Bearer ${this.poliNetworkToken.access_token}`
        }
        return config
    }

    /**
     * intercepts successful responses from server and
     * does (or will do) something before `.then` is called
     * */
    private _handleResponse = (res: AxiosResponse): AxiosResponse => {
        return res
    }

    /**
     * intercepts unsuccessful responses before `.catch` is called
     * and manages retries on proper Axios Instance passed as a parameter
     * */
    private _handleError = async (
        error: AxiosError,
        instance: AxiosInstance
    ) => {
        const { config, response } = error
        if (!config) throw error

        if (response?.status === 500) {
            if (config.retryType === RetryType.RETRY_INDEFINETELY) {
                console.log("Retrying until request is successful")
                await wait(config.waitingTime ?? DEFAULT_WAITING_TIME)
                return instance(config)
            } else if (config.retryType === RetryType.RETRY_N_TIMES) {
                const retryCount = (config.retryCount ?? 0) + 1
                if (retryCount <= (config.maxRetries ?? DEFAULT_MAX_RETRIES)) {
                    console.log(
                        `Try number ${retryCount}/${
                            config.maxRetries ?? DEFAULT_MAX_RETRIES
                        }`
                    )
                    await wait(config.waitingTime ?? DEFAULT_WAITING_TIME)
                    return instance({ ...config, retryCount })
                }
            }
            console.log(
                "RetryType.NO_RETRY or maximum numbers of retries reached"
            )
            throw error
        } else if (response?.status === 401) {
            if (config.authType === AuthType.POLIMI) {
                const success = await refreshPolimiToken()
                // TODO: should retryCount be increased?
                if (success) return instance(config)
                else {
                    console.warn("Error: could not refresh Polimi token")
                    console.warn("Should disconnect user")
                    // void this.destroyTokens()
                    throw error
                }
            } else if (config.authType === AuthType.POLINETWORK) {
                const success = await refreshPoliNetworkToken()
                if (success) return instance(config)
                else {
                    console.warn("Error: could not refresh PoliNetwork token")
                    console.warn("Should disconnect user")
                    // void this.destroyTokens()
                    throw error
                }
            }
            throw error
        }
        throw error
    }
}
// ? The following functions need to be defined here because they are called
// ? inside Http Client interceptors. Maybe move interceptors out of
// ? HttpClient class in a different files? I dont know.

/**
 * refresh the polimi token, returns the success value
 * @returns true if the token was refreshed, false otherwise
 */
export const refreshPolimiToken = async () => {
    console.log("Refreshing polimi token")
    if (!api.polimiToken || !api.poliNetworkToken) {
        console.log("Tokens went missing while trying to refresh Polimi token")
        return false
    }

    const url = "/oauth/token/refresh/" + api.polimiToken?.refreshToken
    try {
        const response = await api.polimiInstance.get<PolimiToken>(url, {
            retryType: RetryType.RETRY_N_TIMES,
        })
        if (typeof response.data.accessToken === "string") {
            console.log("Refreshed polimi token")

            api.polimiToken = response.data
            const tokens: Tokens = {
                poliNetworkToken: api.poliNetworkToken,
                polimiToken: api.polimiToken,
            }
            await AsyncStorage.setItem("api:tokens", JSON.stringify(tokens))

            return true
        }
        console.warn("Invalid response refreshing polimi token")
        console.warn(response.status)
        console.warn(response.data)
        return false
    } catch (e) {
        console.warn("Error refreshing polimi token")
        console.warn(e)
        return false
    }
}

export const refreshPoliNetworkToken = async () => {
    console.log("Refreshing polinetwork token")
    if (!api.polimiToken || !api.poliNetworkToken) {
        console.log(
            "Tokens went missing while trying to refresh PoliNetwork token"
        )
        return false
    }

    try {
        const response = await api.poliNetworkInstance.get<PoliNetworkToken>(
            "/v1/auth/refresh",
            {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    Token: api.poliNetworkToken?.refresh_token,
                },
                retryType: RetryType.RETRY_N_TIMES,
                maxRetries: 5,
            }
        )
        if (typeof response.data.access_token === "string") {
            console.log("Refreshed polinetwork token")

            api.poliNetworkToken = response.data

            // save back the tokens
            const tokens: Tokens = {
                poliNetworkToken: api.poliNetworkToken,
                polimiToken: api.polimiToken,
            }
            await AsyncStorage.setItem("api:tokens", JSON.stringify(tokens))

            return true
        } else {
            console.warn("Invalid response refreshing polinetwork token")
            console.warn(response.status)
            console.warn(response.data)
            return false
        }
    } catch (e) {
        console.warn("Error refreshing polinetwork token")
        console.warn(e)
        return false
    }
}
/**
 * load tokens from storage on boot, if they aren't present, do nothing
 */
export const loadTokens = async () => {
    const tokens = await AsyncStorage.getItem("api:tokens")
    if (tokens) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsedTokens: Tokens = JSON.parse(tokens)
        console.log("Loaded tokens from local storage")
        api.polimiToken = parsedTokens.polimiToken
        api.poliNetworkToken = parsedTokens.poliNetworkToken
        api.emit("login")
        api.emit("login_event", true)
    } else {
        console.log("No tokens found in local storage")
    }
}

/**
 * default options for api requests
 *
 * @param retryType
 * You can have specific behaviour in case of errors, namely:
 * - retry until request succeds ---> `RetryType.RETRY_INDEFINETELY`
 * - retry n times ---> `RetryType.RETRY_N_TIMES`
 * - no retry ---> `RetryType.NO_RETRY`
 * @default retryType.RETRY_INDEFINETELY
 * @param maxRetries maximum number of retries if `RetryType.RETRY_N_TIMES` is selected
 * @default DEFAULT_MAX_RETRIES
 * @param waitingTime seconds to wait before retrying request
 * @default DEFAULT_WAITING_TIME
 */
export interface RequestOptions {
    retryType?: RetryType
    maxRetries?: number
    waitingTime?: number
}

export enum AuthType {
    NONE,
    POLIMI,
    POLINETWORK,
}

const DEFAULT_MAX_RETRIES = 5
const DEFAULT_WAITING_TIME = 3 //seconds

export const defaultReqOptions: RequestOptions = {
    retryType: RetryType.RETRY_INDEFINETELY,
    maxRetries: DEFAULT_MAX_RETRIES,
    waitingTime: DEFAULT_WAITING_TIME,
}

export const api = HttpClient.getInstance()

/**
 * Custom Hook used to wait for the tokens to be loaded before booting the app
 * This will return true once the token are read from storage, wether they are
 * present or not
 * @returns true if the promise has returned, false otherwise
 */
export const useLoadTokens = () => {
    const [loaded, setLoaded] = React.useState(false)
    React.useEffect(() => {
        void loadTokens().then(() => setLoaded(true))
    }, [api]) // this has to be here for hot reload to work
    return loaded
}
