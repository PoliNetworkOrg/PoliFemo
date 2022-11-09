/* eslint-disable @typescript-eslint/naming-convention */
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    AxiosRequestConfig,
} from "axios"

/*Docs used to make this:
Singleton:
https://levelup.gitconnected.com/use-case-of-singleton-with-axios-and-typescript-da564e76296

Error retrying:
https://stackblitz.com/edit/retry-api-call-axios-interceptor?file=index.ts
*/

const ONE_MINUTE = 60 * 60
const MAX_RETRIES = 5

export enum RetryType {
    RETRY_INDEFINETELY,
    RETRY_N_TIMES,
    NO_RETRY,
}

//in this way we can add fields to AxiosRequestConfig for more control in case of errors
declare module "axios" {
    export interface AxiosRequestConfig {
        retryType?: RetryType
        maxRetries?: number
        waitingTime?: number //seconds
        retryCount?: number
    }
}

//in this way we can keep track of number of retries already done when errors occur
/* interface AxiosConfig extends AxiosRequestConfig {
    retryCount?: number
}

interface AxiosConfigCustom extends AxiosConfig {
    retryCount: number
} */
/* interface AxiosErrorCustom extends AxiosError {
    config: AxiosRequestConfig
} */

export default class MainApi {
    private static classInstance?: MainApi

    private readonly instance: AxiosInstance

    public static getInstance(baseUrl: string) {
        if (!this.classInstance) {
            this.classInstance = new MainApi(baseUrl)
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

    private _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError
        )
    }

    //intercepts successfull responses from server and
    //does (or will do) something before .then is called
    private _handleResponse = (res: AxiosResponse): AxiosResponse => {
        console.log("successful response intercepted")
        return res
    }

    //intercepts unsuccessful responses before .catch is called
    //and manages retries --- not working properly (too much hardcoded)
    private _handleError = (error: AxiosError) => {
        /*
        error 429 -> too many requests
        error 500-503 -> server error
        */
        const { config, message, response } = error
        //DEBUGGING INFO
        /* console.log("error response status: " + error.response?.status)
        console.log("error status: " + error.status)
        console.log("error message: " + error.message)
        console.log("error method" + error.config?.method) */
        // END DEBUGGING INFO

        console.log("intercepted error - now decide if retry")

        /* if (message === "Network Error") {
            //no retry
            console.log("network error, bad address!")
            return Promise.reject(error)
        } */
        if (
            (response?.status == 429 ||
                response?.status === 503 ||
                response?.status === 500 ||
                message === "Network Error") &&
            config
        ) {
            if (config.retryType === RetryType.RETRY_INDEFINETELY) {
                console.log("Retrying until request is successful")
                return new Promise((resolve, _) => {
                    //waiting time [seconds]
                    const waitingTime = config.waitingTime ?? 3
                    console.log("waiting some time: " + waitingTime + "s")
                    setTimeout(() => {
                        resolve(this._retryMatchUrl(config))
                    }, waitingTime * 1000)
                })
            } else if (config.retryType === RetryType.RETRY_N_TIMES) {
                const retryCount = (config.retryCount ?? 0) + 1
                console.log(
                    "Retrying at most " +
                        (config.maxRetries ?? MAX_RETRIES) +
                        " times"
                )
                console.log("Try number #" + config.retryCount)
                config.retryCount = retryCount
                if (retryCount <= (config.maxRetries ?? MAX_RETRIES)) {
                    return new Promise((resolve, _) => {
                        //waiting time [seconds]
                        const waitingTime = config.waitingTime ?? 3
                        console.log("waiting some time: " + waitingTime + "s")
                        setTimeout(() => {
                            resolve(this._retryMatchUrl(config))
                        }, waitingTime * 1000)
                    })
                }
            }
            console.log("Retry Type is set to RetryType.NO_TRY... not retrying")
            return Promise.reject(error)
        } else {
            if (config == undefined) {
                console.log(
                    "error config is undefined, what went wrong? Does this even happen?"
                )
            }
            return Promise.reject(error)
        }
    }

    private _retryMatchUrl = (config: AxiosRequestConfig) => {
        if (config.url === "/mock/articles") {
            if (config.retryCount === 2) {
                config.baseURL = "https://api.polinetwork.org:446/"
            }
            console.log("retry count: " + config.retryCount)
            console.log("retry type: " + config.retryType)
            return this.instance
                .get<Article[]>("/mock/articles", {
                    baseURL: config.baseURL,
                    retryType: config.retryType,
                    maxRetries: config.maxRetries ?? MAX_RETRIES,
                    retryCount: config.retryCount ?? undefined,
                })
                .then(res => {
                    console.log("successful")
                    return res
                })
        }
    }

    //this method gets mock articles from swagger
    public getArticles = (
        retryType: RetryType = RetryType.RETRY_INDEFINETELY,
        maxRetries?: number,
        retryCount = 0
    ) =>
        this.instance.get<Article[]>("/mock/articles", {
            retryType: retryType,
            maxRetries: maxRetries ?? undefined,
            retryCount: retryCount,
        })
}

// article object taken from swagger
export interface Article {
    event_id: number
    date_start: Date
    date_end: Date
    favourite: boolean
    show_agenda: boolean
    matricola: number
    title: {
        it: string
        en: string
    }
    event_type: {
        typeId: string
        type_dn: {
            it: string
            en: string
        }
    }
    calendar: {
        calendar_id: number
        calendar_dn: {
            it: string
            en: string
        }
    }
    room: {
        room_id: number
        acronym_dn: number
        classroom_id: number
        room_dn: string
    }
}
