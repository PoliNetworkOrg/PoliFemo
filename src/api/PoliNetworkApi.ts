import { getIsoStringFromDaysPassed } from "utils/functions"
import { Articles } from "./Article"
import { Lecture } from "./Lecture"
import { api, defaultReqOptions, RequestOptions } from "./HttpClient"
import { Tags } from "./Tag"

/**
 * Api Object that serves as a collection of calls to the PoliNetwork Api.
 * Eventually, this object will be divided into smaller ones for more specificity
 *
 * To make a request to PoliNetwork Server:
 *
 * @example
 * ```ts
 *       poliNetworkApi.getTags({retryType : RetryType.RETRY_INDEFINETELY})
 *           .then(response => {
 *               const tags: Tag[] = response
 *               //do something
 *           })
 *           .catch(err => console.log(err))
 * ```
 *
 *
 * for additional request options see {@link RequestOptions}
 */
export const poliNetworkApi = {
    async getArticlesFromDaysAgoTillDate(
        days: number,
        end: string,
        options?: RequestOptions
    ) {
        const start: string = getIsoStringFromDaysPassed(days)
        const response = await api.poliNetworkInstance.get<Articles>(
            "/v1/articles",
            {
                ...defaultReqOptions,
                ...options,
                params: { start: start, end: end },
            }
        )
        return response.data.results
    },
    /**
     * Retrieves articles from PoliNetwork server, given a starting and ending ISO date.
     *
     * @param options see {@link RequestOptions}
     */
    async getArticlesFromDateTillDate(
        start: string,
        end: string,
        options?: RequestOptions
    ) {
        const response = await api.poliNetworkInstance.get<Articles>(
            "/v1/articles",
            { ...defaultReqOptions, ...options }
        )

        return response.data.results
    },

    /**
     * Retrieves Tags (news categories) from PoliNetwork server.
     * @param options see {@link RequestOptions}
     * */
    async getTags(options?: RequestOptions) {
        const response = await api.poliNetworkInstance.get<Tags>("/v1/tags", {
            ...defaultReqOptions,
            ...options,
        })
        return response.data.tags
    },

    /**
     * Retrieves mock timetable from PoliNetwork server.
     *
     * @param options see {@link RequestOptions}
     *
     * @example
     * ```ts
     *  poliNetworkApi.getTimetable()
     *     .then(response => {
     *          const timetable: Lecture[] = response
     *          //do something
     *      })
     *      .catch(err => console.log(err))
     * }
     * ```
     * */
    async getTimetable(options: RequestOptions) {
        const response = await api.poliNetworkInstance.get<Lecture[]>(
            "/v1/mock/timetable",
            { ...defaultReqOptions, ...options }
        )
        return response.data
    },
}
