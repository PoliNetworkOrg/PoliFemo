import { getIsoStringFromDaysPassed } from "utils/functions"
import { HttpClient, RequestOptions } from "./HttpClient"

/* eslint-disable @typescript-eslint/naming-convention */

export interface GroupOptions {
    name?: string
    year?: string
    degree?: string
    type?: string
    platform?: string
    language?: string
    office?: string
}

const client = HttpClient.getInstance()

/**
 * Collection of endpoints related to Groups.
 */
export const groups = {
    /**
     * Retrieves groups from PoliNetwork server.
     * Check {@link GroupOptions} for additional parameters.
     */
    // ! temporary
    async get(groupsOptions?: GroupOptions, options?: RequestOptions) {
        const response = await client.poliNetworkInstance.get<any>(
            "/v1/groups/search",
            {
                ...options,
                params: {
                    name: groupsOptions?.name,
                    year: groupsOptions?.year,
                    degree: groupsOptions?.degree,
                    type: groupsOptions?.type,
                    platform: groupsOptions?.platform,
                    language: groupsOptions?.language,
                    office: groupsOptions?.office,
                },
            }
        )
        return response.data.results
    },
}
