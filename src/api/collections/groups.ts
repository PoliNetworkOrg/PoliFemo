import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"
import { HttpClient, RequestOptions } from "../HttpClient"
import { groupSchema } from "api/schemas"
import { z } from "zod"

const client = HttpClient.getInstance()

/**
 * Collection of endpoints related to Groups.
 */
export const groups = {
  /**
   * Retrieves groups from Github.
   * Check {@link GroupOptions} for additional parameters.
   */

  getFromGithub(_params?: Record<string, unknown>, options?: RequestOptions) {
    const request = client.callGeneral({
      url: "https://raw.githubusercontent.com/PoliNetworkOrg/polinetworkWebsiteData/main/groupsGenerated.json",
      method: "GET",
      ...options,
      zodSchema: z.object({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        index_data: groupSchema.array(),
      }),
    })
    return mapAxiosRequest(request, response => response.index_data)
  },
} satisfies ApiCollection
