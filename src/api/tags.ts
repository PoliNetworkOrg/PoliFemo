import { client, RequestOptions } from "./httpClient"

export interface Tags {
    tags: Tag[]
}

export interface Tag {
    name: string
    image: string
}

/**
 * Collection of endpoints related to Tags.
 */
export const tags = {
    /**
     * Retrieves Tags (news categories) from PoliNetwork server.
     * @param options see {@link RequestOptions}
     * */
    async get(options?: RequestOptions) {
        const response = await client.poliNetworkInstance.get<Tags>(
            "/v1/tags",

            options
        )
        return response.data.tags
    },
}
