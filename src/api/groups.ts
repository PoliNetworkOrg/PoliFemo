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

export interface Group {
    class: string
    office: string
    id: string
    degree?: string
    school?: string
    link_id: string
    language: string
    type_?: string
    year: string | null //probably I should use  | null evreywhere?
    platform: string
    permanent_id?: number
    last_updated?: string
    link_is_working?: string
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
    async get(groupsOptions?: GroupOptions, options?: RequestOptions) {
        const response = await client.poliNetworkInstance.get<{
            groups: Group[]
        }>("/v1/groups", {
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
        })
        return response.data.groups
    },
}
