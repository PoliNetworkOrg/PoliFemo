import { getIsoStringFromDaysPassed } from "utils/functions"
import { client, RequestOptions } from "./httpClient"

/* eslint-disable @typescript-eslint/naming-convention */
export interface Articles {
    results: Article[]
}
export interface Article {
    title: string
    subtitle?: string
    latitude?: number
    longitude?: number
    publish_time?: string
    target_time?: string
    content: string
    image?: string
    author?: { name?: string; link?: string; image?: string }
}

/**
 * Collection of endpoints related to Articles.
 */
export const articles = {
    async getFromDaysAgoTillDate(
        days: number,
        end: string,
        options?: RequestOptions
    ) {
        const start: string = getIsoStringFromDaysPassed(days)
        const response = await client.poliNetworkInstance.get<Articles>(
            "/v1/articles",
            {
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
    async getFromDateTillDate(
        start: string,
        end: string,
        options?: RequestOptions
    ) {
        const response = await client.poliNetworkInstance.get<Articles>(
            "/v1/articles",
            options
        )

        return response.data.results
    },
}
