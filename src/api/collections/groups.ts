import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"
import { HttpClient, RequestOptions } from "../HttpClient"

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
  class: string | null
  office?: string
  id: string
  degree?: string
  school?: string
  id_link: string
  language?: string
  type?: string
  year: string | null //probably I should use  | null everywhere?
  platform: string
  permanentId?: number
  LastUpdateInviteLinkTime?: string
  linkfunzionante?: string
  LinkType?: string
  members?: string
}

const client = HttpClient.getInstance()

/**
 * Collection of endpoints related to Groups.
 */
export const groups = {
  /**
   * Retrieves groups from Github.
   * Check {@link GroupOptions} for additional parameters.
   */

  getFromGithub(_params?: Record<string, never>, options?: RequestOptions) {
    const request = client.callGeneral<{
      index_data: Group[]
    }>({
      url: "https://raw.githubusercontent.com/PoliNetworkOrg/polinetworkWebsiteData/main/groupsGenerated.json",
      method: "GET",
      ...options,
    })
    return mapAxiosRequest(request, response => response.index_data)
  },
} satisfies ApiCollection
