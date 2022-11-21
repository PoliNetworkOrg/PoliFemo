import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios"
import { Articles } from "./Article"
import { RetryType } from "./RetryType"
import { Tags } from "./Tag"

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
    }
}
/**
 * Singleton object which manages requests to PoliNetwork Server.
 *
 * Retrieve the instance of MainApi in order to make a request:
 *
 * ```
 * import { api } from "api"
 * ```
 *
 * Call a public method on the instance object in order to make a request.
 * @param retryType
 * You can have specific behaviour in case of errors, namely:
 * - retry until request succeds ---> `RetryType.RETRY_INDEFINETELY`
 * - retry n times ---> `RetryType.RETRY_N_TIMES`
 * - no retry ---> `RetryType.NO_RETRY`
 *
 *
 * You can also specify additional params to a request:
 * @param maxRetries maximum number of retries if `RetryType.RETRY_N_TIMES` is selected
 * @param waitingTime seconds to wait before retrying request
 * @param days see {@link getArticlesFromDate}
 * @param retryCount how many retries have already been done, this param shouldn't be changed. its purpose is only to keep track of the retry count and is kept up to date by the MainApi object
 *
 * @example
 * ```ts
 *       api.getTags(RetryType.RETRY_N_TIMES, 5, 3)
 *           .then(response => {
 *               //maxRetries = 5
 *               //waitingTime = 3s
 *               const articles: Tag[] = response
 *               //do something
 *           })
 *           .catch(err => console.log(err))
 * ```
 *
 */
export default class MainApi {
    private static classInstance?: MainApi

    private readonly instance: AxiosInstance

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
        this.instance = axios.create({
            baseURL: baseUrl,
            timeout: 2000,
        })
        this._initializeResponseInterceptor()
    }

    /**
     * initialize interceptors functions
     * */
    private _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError
        )
    }

    /**
     * intercepts successful responses from server and
     * does (or will do) something before `.then` is called
     * */
    private _handleResponse = (res: AxiosResponse): AxiosResponse => {
        console.log("successful response intercepted")
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
     * @param retryType
     * @default retryType.RETRY_INDEFINETELY
     * @param maxRetries maximum number of retries if `RetryType.RETRY_N_TIMES` is selected
     * @default DEFAULT_MAX_RETRIES
     * @param waitingTime seconds to wait before retrying request
     * @default DEFAULT_WAITING_TIME
     * @param days
     * @default 7
     * @param retryCount how many retries have already been done, don't change this.
     * @default 0
     *
     * @example
     * ```ts
     *  api.getArticlesFromDate(RetryType.RETRY_N_TIMES, 5, 3, 30)
     *      //maxRetries = 5
     *      //waitingTime = 3s
     *      //days = 30
     *     .then(response => {
     *          const articles: Article[] = response
     *          //do something
     *      })
     *      .catch(err => console.log(err))
     * }
     * ```
     * */
    public getArticlesFromDate = async (
        retryType: RetryType = RetryType.RETRY_INDEFINETELY,
        maxRetries = DEFAULT_MAX_RETRIES,
        waitingTime = 3,
        days?: number,
        retryCount = 0
    ) => {
        const start: string = getIsoStringFromDaysPassed(days ?? 7)
        const end = new Date().toISOString()
        console.log("start " + start)
        console.log("end " + start)
        const response = await this.instance.get<Articles>(
            `/v1/articles/timerange/${start}/${end}`,
            {
                retryType: retryType,
                maxRetries: maxRetries,
                waitingTime: waitingTime,
                retryCount: retryCount,
            }
        )
        return response.data.results
    }

    /**
     * Retrieves Tags (news categories) from PoliNetwork server.
     *
     *
     * @example
     * ```ts
     *  api.getTags(RetryType.RETRY_N_TIMES, 5, 3)
     *      //maxRetries = 5
     *      //waitingTime = 3s
     *     .then(response => {
     *          const tags: Tag[] = response
     *      })
     *      .catch(err => console.log(err))
     * }
     * ```
     * */
    public getTags = async (
        retryType: RetryType = RetryType.RETRY_INDEFINETELY,
        maxRetries = DEFAULT_MAX_RETRIES,
        waitingTime = 3,
        retryCount = 0
    ) => {
        const response = await this.instance.get<Tags>("/v1/tags", {
            retryType: retryType,
            maxRetries: maxRetries,
            waitingTime: waitingTime,
            retryCount: retryCount,
        })
        return response.data.tags
    }
}

/**
 * takes as input a number, let's say "n".
 * Returns the ISO date string of "n" days ago
 *
 * the name of this function can improve D:
 */
function getIsoStringFromDaysPassed(n: number): string {
    //todays'date
    const today = new Date()
    //today's date in milliseconds from the beginning of time
    const time = today.getTime()
    console.log(time)
    //milliseconds in n days
    const timeToSubtract = n * 24 * 60 * 60 * 1000
    console.log(timeToSubtract)
    //n-days-ago's date in milliseconds from the beginning of time
    const newTime = time - timeToSubtract
    //n-days-ago's date
    const newDate = new Date(newTime)

    return newDate.toISOString()
}
