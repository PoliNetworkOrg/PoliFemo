import { EventEmitter } from "events"
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"
import { PolimiToken, PoliNetworkToken, Tokens } from "contexts/login"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { wait } from "utils/functions"
import { Alert } from "react-native"
import { httpClientLog } from "utils/logger"

/*Docs used to make this:
Singleton:
https://levelup.gitconnected.com/use-case-of-singleton-with-axios-and-typescript-da564e76296

Error retrying:
https://stackblitz.com/edit/retry-api-call-axios-interceptor?file=index.ts
*/

/**
 * Cancellable API request interface
 * @template T type of the cached response
 * @template D type of the awaited response, by default `AxiosResponse<T, unknown>`
 * @extends Promise<D> the promise resolves to the response
 */
export interface CancellableApiRequest<T, D = AxiosResponse<T, unknown>>
  extends Promise<D> {
  /**
   * Aborts the request
   * @param reason optional abort reason
   */
  cancel: (reason?: unknown) => void
  /**
   * Cached response, if any
   */
  cachedResponse: T | null
}

export enum AuthType {
  NONE,
  POLIMI,
  POLINETWORK,
}

export enum RetryType {
  RETRY_INDEFINETELY,
  RETRY_N_TIMES,
  NO_RETRY,
}

/**
 * Request options interface
 */
export interface RequestOptions {
  retryType?: RetryType
  maxRetries?: number
  waitingTime?: number
}

/**
 * Default request options for api requests
 */
export const defaultOptions = {
  retryType: RetryType.RETRY_INDEFINETELY,
  maxRetries: 5,
  waitingTime: 3000,
}

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
 * instead, check {@link api} for making requests.
 *
 * This object also manages auth tokens.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
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
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class HttpClient extends EventEmitter {
  private static classInstance?: HttpClient

  readonly polimiInstance: AxiosInstance
  readonly poliNetworkInstance: AxiosInstance
  readonly generalInstance: AxiosInstance

  private polimiToken?: PolimiToken
  private poliNetworkToken?: PoliNetworkToken

  // TODO: await for token to refresh before sending multiple requests

  /**
   * retrieves singleton instance.
   * */
  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new HttpClient(
        "https://api.polinetwork.org/staging/",
        "https://polimiapp.polimi.it/polimi_app"
      )
    }

    return this.classInstance
  }

  private constructor(baseUrlPoliNetwork: string, baseUrlPolimi: string) {
    super()
    httpClientLog.debug("HttpClient constructor called")
    this.poliNetworkInstance = axios.create({
      baseURL: baseUrlPoliNetwork,
      timeout: 30000,
    })
    this.polimiInstance = axios.create({
      baseURL: baseUrlPolimi,
      timeout: 30000,
    })
    this.generalInstance = axios.create({
      timeout: 30000,
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
      err => this._handleError(err as AxiosError, this.poliNetworkInstance)
    )
    this.polimiInstance.interceptors.request.use(this._handleRequest)
    this.polimiInstance.interceptors.response.use(
      val => this._handleResponse(val),
      err => this._handleError(err as AxiosError, this.polimiInstance)
    )
    this.generalInstance.interceptors.request.use(this._handleRequest)
    this.generalInstance.interceptors.response.use(
      val => this._handleResponse(val),
      err => this._handleError(err as AxiosError, this.generalInstance)
    )
  }

  private _handleRequest = (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers ?? {}
    if (config.authType === AuthType.POLIMI && this.polimiToken) {
      config.headers["Authorization"] = `Bearer ${this.polimiToken.accessToken}`
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
  private _handleError = async (error: AxiosError, instance: AxiosInstance) => {
    if (!error.config) throw error

    const config = {
      ...defaultOptions,
      ...error.config,
    }
    const response = error.response

    if (response?.status === 500) {
      if (config.retryType === RetryType.RETRY_INDEFINETELY) {
        console.log("Retrying until request is successful")
        await wait(config.waitingTime)
        return instance(config)
      } else if (config.retryType === RetryType.RETRY_N_TIMES) {
        const retryCount = (config.retryCount ?? 0) + 1
        if (retryCount <= config.maxRetries) {
          console.log(`Try number ${retryCount}/${config.maxRetries}`)
          await wait(config.waitingTime)
          return instance({ ...config, retryCount })
        }
      } else {
        console.log("You selected NO_RETRY!")
        throw error
      }
      console.log("Maximum numbers of retries reached!")
      throw error
    } else if (response?.status === 401) {
      if (config.authType === AuthType.POLIMI) {
        const success = await this.refreshPolimiToken()
        if (success) {
          return instance(config)
        } else {
          httpClientLog.error("Error: could not refresh Polimi token")
          httpClientLog.error("Error:")
          httpClientLog.error(error)
          httpClientLog.error("Call config:")
          httpClientLog.error(JSON.stringify(config))
          Alert.alert(
            "An error has occurred while refreshing Polimi token",
            `The call to ${
              config.url ?? "undefined"
            } failed, is the token invalid?\n\nThis is a debug option, if you think this is an error, please report it and try again later, otherwise you can logout`,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Logout",
                onPress: () => {
                  void this.destroyTokens()
                },
              },
            ]
          )
          throw error
        }
      } else if (config.authType === AuthType.POLINETWORK) {
        const success = await this.refreshPoliNetworkToken()
        if (success) return instance(config)
        else {
          console.warn("Error: could not refresh PoliNetwork token")
          console.warn("Error:")
          console.warn(error)
          console.warn("Call config:")
          console.warn(JSON.stringify(config))
          Alert.alert(
            "An error has occurred while refreshing PoliNetwork token",
            `The call to ${
              config.url ?? "undefined"
            } failed, is the token invalid?\n\nThis is a debug option, if you think this is an error, please report it and try again later, otherwise you can logout`,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Logout",
                onPress: () => {
                  void this.destroyTokens()
                },
              },
            ]
          )

          throw error
        }
      }
      throw error
    }
    throw error
  }

  callPolimi<T = void>(options: AxiosRequestConfig): CancellableApiRequest<T> {
    const controller = new AbortController()
    const request = this.polimiInstance.request<T>({
      ...options,
      signal: controller.signal,
    }) as CancellableApiRequest<T>
    request.cancel = r => controller.abort(r)
    // TODO: handle cache ?
    request.cachedResponse = null
    return request
  }

  callPoliNetwork<T = void>(
    options: AxiosRequestConfig
  ): CancellableApiRequest<T> {
    const controller = new AbortController()
    const request = this.poliNetworkInstance.request<T>({
      ...options,
      signal: controller.signal,
    }) as CancellableApiRequest<T>
    request.cancel = r => controller.abort(r)
    // TODO: handle cache ?
    request.cachedResponse = null
    return request
  }

  callGeneral<T = void>(options: AxiosRequestConfig): CancellableApiRequest<T> {
    const controller = new AbortController()
    const request = this.generalInstance.request<T>({
      ...options,
      signal: controller.signal,
    }) as CancellableApiRequest<T>
    request.cancel = r => controller.abort(r)
    // TODO: handle cache ?
    request.cachedResponse = null
    return request
  }

  /**
   * refresh the polimi token, returns the success value
   * @returns true if the token was refreshed, false otherwise
   */
  async refreshPolimiToken() {
    console.log("Refreshing polimi token")
    if (!this.polimiToken || !this.poliNetworkToken) {
      console.log("Tokens went missing while trying to refresh Polimi token")
      return false
    }

    const url =
      "/rest/jaf/oauth/token/refresh/" + this.polimiToken?.refreshToken
    try {
      const response = await this.polimiInstance.get<PolimiToken>(url, {
        retryType: RetryType.RETRY_N_TIMES,
      })
      if (typeof response.data.accessToken === "string") {
        console.log("Refreshed polimi token")

        this.polimiToken = response.data
        const tokens: Tokens = {
          poliNetworkToken: this.poliNetworkToken,
          polimiToken: this.polimiToken,
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

  async refreshPoliNetworkToken() {
    console.log("Refreshing polinetwork token")
    if (!this.polimiToken || !this.poliNetworkToken) {
      console.log(
        "Tokens went missing while trying to refresh PoliNetwork token"
      )
      return false
    }

    try {
      const response = await this.poliNetworkInstance.get<PoliNetworkToken>(
        "/v1/auth/refresh",
        {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Token: this.poliNetworkToken?.refresh_token,
          },
          retryType: RetryType.RETRY_N_TIMES,
          maxRetries: 5,
        }
      )
      if (typeof response.data.access_token === "string") {
        console.log("Refreshed polinetwork token")

        this.poliNetworkToken = response.data

        // save back the tokens
        const tokens: Tokens = {
          poliNetworkToken: this.poliNetworkToken,
          polimiToken: this.polimiToken,
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
  async loadTokens() {
    const tokens = await AsyncStorage.getItem("api:tokens")
    if (tokens) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsedTokens: Tokens = JSON.parse(tokens)
      console.log("Loaded tokens from local storage")
      this.polimiToken = parsedTokens.polimiToken
      this.poliNetworkToken = parsedTokens.poliNetworkToken
      this.emit("login")
      this.emit("login_event", true)
    } else {
      httpClientLog.info("No tokens found in local storage")
    }
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
    console.log("Destroying tokens, logging out")

    this.polimiToken = undefined
    this.poliNetworkToken = undefined

    this.emit("logout")
    this.emit("login_event", false)

    // remove the tokens from local storage
    await AsyncStorage.removeItem("api:tokens")
  }
}
