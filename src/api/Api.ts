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

interface AxiosConfig extends AxiosRequestConfig {
    retryCount?: number
}

interface AxiosConfigCustom extends AxiosConfig {
    retryCount: number
}
interface AxiosErrorCustom extends AxiosError {
    config: AxiosConfigCustom
}

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
    private _handleError = (error: AxiosErrorCustom) => {
        /*
        error 429 -> too many requests
        error 500-503 -> server error
        */

        //DEBUGGING INFO
        console.log("error response status: " + error.response?.status)
        console.log("error status: " + error.status)
        console.log("error message: " + error.message)
        console.log("error method" + error.config.method)
        // END DEBUGGING INFO

        console.log("intercepted error - now decide if retry")

        if (error.message === "Network Error") {
            //no retry
            console.log("network error, bad address!")
            return Promise.reject(error)
        }
        if (
            error.response?.status == 429 ||
            error.response?.status === 503 ||
            error.response?.status === 500
            // ? *** si può aggiungere un campo ad error.config per stabilire
            // ? *** se la chiamata vuole il retry?
            // ? ***
            // ? *** Altrimenti diventa molto hardcoded, a priori bisogna
            // ? *** stabilire a quale URL c'è retry o meno. Conosciamo l'url della
            // ? *** chiamata grazie a error.config.url
            // ? ***
            // ? *** Sarebbe ottimale poter dire tipo:
            // ? *** MainApi.getArticles(retry : True, maxRetries : 3)
            // ? ***
            // ? *** ma non so bene come fare a passare tipo:
            // ? *** this.instance.get<Article[]>("/mock/articles", {retry : True})
            // ? *** poichè il config object dentro la get non ha un campo di nome retry
        ) {
            // set a retry count parameter
            const retryCount = (error.config.retryCount ?? 0) + 1
            error.config.retryCount = retryCount
            // ? MAX_RETRIES sono ancora hardcoded
            if (retryCount <= MAX_RETRIES) {
                return new Promise((resolve, _) => {
                    //waiting time [seconds]
                    const waitingTime = 10
                    console.log("waiting some time: " + waitingTime + "s")
                    setTimeout(
                        () => {
                            // ? C'è un modo migliore?? come è adesso è hardcoded
                            // ? a questo URL corrisponde retry.
                            if (error.config.url == "/mock/articles") {
                                console.log("retrying get request")
                                resolve(this.getArticles())
                            }
                        },
                        // ? decide waiting time, always the same?
                        // ? decided by the user?
                        waitingTime * 1000
                    )
                })
            }
            return Promise.reject(error)
        } else {
            return Promise.reject(error)
        }
    }

    //this method gets mock articles from swagger
    public getArticles = () => this.instance.get<Article[]>("/mock/articles")
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
