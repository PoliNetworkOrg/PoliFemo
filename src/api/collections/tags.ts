import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"
import { HttpClient, RequestOptions } from "../HttpClient"

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
  getTags(_params?: Record<string, unknown>, options?: RequestOptions) {
    const request = client.callPoliNetwork<Tags>({
      url: "/v1/tags",
      method: "GET",
      ...options,
    })

    return mapAxiosRequest(request, res => res.tags)
  },
} satisfies ApiCollection
