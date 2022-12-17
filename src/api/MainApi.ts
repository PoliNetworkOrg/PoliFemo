import { EventEmitter } from "events"
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios"
import { Lecture } from "./Lecture"
import { getIsoStringFromDaysPassed } from "utils/dates"
import { Articles } from "./Article"
import { RetryType } from "./RetryType"
import { Tags } from "./Tag"
import { PolimiToken, PoliNetworkToken, Tokens } from "utils/login"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"

/*Docs used to make this:
Singleton:
https://levelup.gitconnected.com/use-case-of-singleton-with-axios-and-typescript-da564e76296

Error retrying:
https://stackblitz.com/edit/retry-api-call-axios-interceptor?file=index.ts
*/

const DEFAULT_MAX_RETRIES = 5
const DEFAULT_WAITING_TIME = 3

//in this way we can add fields to AxiosRequestConfig for more control in case of errors
declare module "axios" {
    export interface AxiosRequestConfig {
        retryType?: RetryType
        maxRetries?: number
        waitingTime?: number //seconds
        retryCount?: number
        authType?: AuthType
    }
}

enum AuthType {
    NONE,
    POLIMI,
    POLINETWORK,
}

/**
 * Singleton object which manages requests to PoliNetwork Server.
 *
 * Retrieve the instance of MainApi in order to make a request:
 *
 * ```
 * import { api } from "api"
 * ```
 * for additional request options see {@link RequestOptions}
 *
 * Call a public method on the instance object in order to make a request.
 *
 *
 *
 * @example
 * ```ts
 *       api.getTags({retryType : RetryType.RETRY_N_TIMES, maxRetries : 5})
 *           .then(response => {
 *               const tags: Tag[] = response
 *               //do something
 *           })
 *           .catch(err => console.log(err))
 * ```
 *
 */
export declare interface MainApi {
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
export class MainApi extends EventEmitter {
    private static classInstance?: MainApi

    private readonly instance: AxiosInstance

    private polimiToken?: PolimiToken
    private poliNetworkToken?: PoliNetworkToken

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
            this.classInstance = new MainApi("https://api.polinetwork.org:446/")
        }

        return this.classInstance
    }

    private constructor(baseUrl: string) {
        super()
        this.instance = axios.create({
            baseURL: baseUrl,
            timeout: 2000,
        })
        this._initializeInterceptors()
    }

    /**
     * initialize interceptors functions
     * */
    private _initializeInterceptors = () => {
        this.instance.interceptors.request.use(this._handleRequest)
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError
        )
    }

    private _handleRequest = (config: AxiosRequestConfig) => {
        // TODO: refresh token if expired
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
     * and manages retries
     * */
    private _handleError = (error: AxiosError) => {
        /*
        error 404 -> not found
        error 500 -> server error
        */
        const { config, response } = error
        console.log("intercepted error")

        if (
            // ? which response statuses need checking ?
            (response?.status === 404 || response?.status === 500) &&
            config
        ) {
            if (config.retryType === RetryType.RETRY_INDEFINETELY) {
                console.log("Retrying until request is successful")
                return new Promise(resolve => {
                    const waitingTime =
                        config.waitingTime ?? DEFAULT_WAITING_TIME
                    console.log("waiting before retrying: " + waitingTime + "s")
                    setTimeout(() => {
                        resolve(
                            this.instance(config).then(res => {
                                return res
                            })
                        )
                    }, waitingTime * 1000)
                })
            } else if (config.retryType === RetryType.RETRY_N_TIMES) {
                const retryCount = (config.retryCount ?? 0) + 1
                config.retryCount = retryCount
                if (retryCount <= (config.maxRetries ?? DEFAULT_MAX_RETRIES)) {
                    console.log(
                        `Try number ${retryCount}/${
                            config.maxRetries ?? DEFAULT_MAX_RETRIES
                        }`
                    )
                    return new Promise(resolve => {
                        const waitingTime =
                            config.waitingTime ?? DEFAULT_WAITING_TIME
                        console.log(
                            "waiting before retrying: " + waitingTime + "s"
                        )
                        setTimeout(() => {
                            resolve(
                                this.instance(config).then(res => {
                                    return res
                                })
                            )
                        }, waitingTime * 1000)
                    })
                }
            }
            console.log(
                "RetryType.NO_RETRY or maximum numbers of retries reached"
            )
            return Promise.reject(error)
        } else if (response?.status === 401) {
            // TODO: handle token refresh / logout when unauthorized
            console.log("401 Unauthorized")
            return Promise.reject(error)
        } else {
            if (config == undefined) {
                console.log(
                    "error: config is undefined, what went wrong? Does this even happen?"
                )
            }
            return Promise.reject(error)
        }
    }

    /**
     * Retrieves articles from PoliNetwork server. Specify param `days` to select
     * articles published in the last n days. Defaults to 7 days.
     *
     * @param days starting point
     * @param end ending date
     *
     * @param options see {@link RequestOptions}
     *
     * @example
     * ```ts
     *  api.getArticlesFromDaysAgoTillDate(7, new Date().toISOString())
     *     .then(response => {
     *          const articles: Article[] = response
     *          //do something
     *      })
     *      .catch(err => console.log(err))
     * }
     * ```
     * */
    public getArticlesFromDaysAgoTillDate = async (
        days: number,
        end: string,
        options?: RequestOptions
    ) => {
        const start: string = getIsoStringFromDaysPassed(days)
        const response = await this.instance.get<Articles>("/v1/articles", {
            retryType: options?.retryType ?? RetryType.RETRY_INDEFINETELY,
            maxRetries: options?.maxRetries ?? DEFAULT_MAX_RETRIES,
            waitingTime: options?.waitingTime ?? 3,
            retryCount: options?.retryCount ?? 0,
            params: { start: start, end: end },
        })
        return response.data.results
    }

    /**
     * Retrieves articles from PoliNetwork server, given a starting and ending ISO date.
     *
     * @param options see {@link RequestOptions}
     */
    public getArticlesFromDateTillDate = async (
        start: string,
        end: string,
        options?: RequestOptions
    ) => {
        const response = await this.instance.get<Articles>("/v1/articles", {
            retryType: options?.retryType ?? RetryType.RETRY_INDEFINETELY,
            maxRetries: options?.maxRetries ?? DEFAULT_MAX_RETRIES,
            waitingTime: options?.waitingTime ?? 3,
            retryCount: options?.retryCount ?? 0,
            params: { start: start, end: end },
        })

        return response.data.results
    }

    /**
     * Retrieves Tags (news categories) from PoliNetwork server.
     *
     * @param options see {@link RequestOptions}
     *
     * @example
     * ```ts
     *  api.getTags()
     *     .then(response => {
     *          const tags: Tag[] = response
     *      })
     *      .catch(err => console.log(err))
     * }
     * ```
     * */
    public getTags = async (options?: RequestOptions) => {
        const response = await this.instance.get<Tags>("/v1/tags", {
            retryType: options?.retryType ?? RetryType.RETRY_INDEFINETELY,
            maxRetries: options?.maxRetries ?? DEFAULT_MAX_RETRIES,
            waitingTime: options?.waitingTime ?? 3,
            retryCount: options?.retryCount ?? 0,
        })
        return response.data.tags
    }

    /**
     * Retrieves mock timetable from PoliNetwork server.
     *
     * @param retryType
     * @default retryType.RETRY_INDEFINETELY
     * @param maxRetries maximum number of retries if `RetryType.RETRY_N_TIMES` is selected
     * @default DEFAULT_MAX_RETRIES
     * @param waitingTime seconds to wait before retrying request
     * @default DEFAULT_WAITING_TIME
     * @param retryCount how many retries have already been done, don't change this.
     * @default 0
     *
     * @example
     * ```ts
     *  api.getTimetable(RetryType.RETRY_N_TIMES, 5, 3)
     *      //maxRetries = 5
     *      //waitingTime = 3s
     *     .then(response => {
     *          const timetable: Lecture[] = response
     *          //do something
     *      })
     *      .catch(err => console.log(err))
     * }
     * ```
     * */
    public getTimetable = async (
        retryType: RetryType = RetryType.RETRY_INDEFINETELY,
        maxRetries = DEFAULT_MAX_RETRIES,
        waitingTime = 3,
        retryCount = 0
    ) => {
        const response = await this.instance.get<Lecture[]>(
            "/v1/mock/timetable",
            {
                retryType: retryType,
                maxRetries: maxRetries,
                waitingTime: waitingTime,
                retryCount: retryCount,
            }
        )
        return response.data
    }

    /**
     * gets the OAuth access token given the polimi authcode from the login flow
     * @param code Polimi AuthCode
     * @returns polimi accessToken and refreshToken
     */
    async getPolimiToken(code: string) {
        const response = await axios.get<PolimiToken>(
            `https://polimiapp.polimi.it/polimi_app/rest/jaf/oauth/token/get/${code}`,
            {
                headers: {
                    accept: "application/json",
                },
            }
        )
        return response.data
    }

    /**
     * set the tokens and save them to storage
     * @param tokens both the polinetwork and polimi tokens
     */
    async setTokens(tokens: Tokens) {
        this.polimiToken = tokens.polimiToken
        this.poliNetworkToken = tokens.poliNetworkToken
        this.emit("login")
        this.emit("login_event", true)
        // save the tokens in local storage
        await AsyncStorage.setItem("api:tokens", JSON.stringify(tokens))
        console.log("Saved tokens in local storage")
    }

    /**
     * remove the tokens from storage, essentially log out
     */
    async destroyTokens() {
        this.polimiToken = undefined
        this.poliNetworkToken = undefined
        this.emit("logout")
        this.emit("login_event", false)
        // remove the tokens from local storage
        await AsyncStorage.removeItem("api:tokens")
    }

    /**
     * load tokens from storage on boot, if they aren't present, do nothing
     */
    async loadTokens() {
        const tokens = await AsyncStorage.getItem("api:tokens")
        if (tokens) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const parsedTokens: Tokens = JSON.parse(tokens)
            console.log("Loaded tokens from local storage")
            console.log(parsedTokens)
            this.polimiToken = parsedTokens.polimiToken
            this.poliNetworkToken = parsedTokens.poliNetworkToken
            this.emit("login")
            this.emit("login_event", true)
        } else {
            console.log("No tokens found in local storage")
        }
    }

    /**
     * test PoliNetwork auth call
     */
    async getPolinetworkMe() {
        const response = await this.instance.get<{
            id: string
        }>("/v1/accounts/me", {
            authType: AuthType.POLINETWORK,
        })
        return response.data
    }

    /**
     * test polimi auth call
     */
    async getPolimiUserInfo() {
        const inst = axios.create()
        inst.interceptors.request.use(this._handleRequest)
        inst.interceptors.response.use(this._handleResponse, this._handleError)
        const response = await inst.get<{
            idPersona: number
            codicePersona: string
            nome: string
            cognome: string
            matricola: string
            classeCarriera: string
            description: string
            initials: string
            email: string
            fotoURL: string
        }>("https://polimiapp.polimi.it/polimi_app/rest/jaf/internal/user", {
            authType: AuthType.POLIMI,
        })
        return response.data
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
 * @param retryCount how many retries have already been done, don't change this.
 * @default 0
 *
 */
export interface RequestOptions {
    retryType?: RetryType
    maxRetries?: number
    waitingTime?: number
    retryCount?: number
}

export const api = MainApi.getInstance()

/**
 * Custom Hook used to wait for the tokens to be loaded before booting the app
 * This will return true once the token are read from storage, wether they are
 * present or not
 * @returns true if the promise has returned, false otherwise
 */
export const useLoadTokens = () => {
    const [loaded, setLoaded] = React.useState(false)
    React.useEffect(() => {
        if (!loaded) void api.loadTokens().then(() => setLoaded(true))
    }, [])
    return loaded
}
