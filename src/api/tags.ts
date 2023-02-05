import { HttpClient, RequestOptions } from "./HttpClient"

export interface Tags {
    tags: Tag[]
}

export interface Tag {
    name: string
    image: string
}

const client = HttpClient.getInstance()
/**
 * Collection of endpoints related to Tags.
 */
export const tags = {
    /**
     * Retrieves Tags (news categories) from PoliNetwork server.
     */
    async getTags(options?: RequestOptions) {
        const response = await client.poliNetworkInstance.get<Tags>(
            "/v1/tags",

            options
        )
        return response.data.tags
    },
}
