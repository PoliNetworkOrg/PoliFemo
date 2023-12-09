/* eslint-disable @typescript-eslint/naming-convention */
import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"
import { AuthType, HttpClient, RequestOptions } from "../HttpClient"

export interface Matters {
  mean: number
  given_cfu: number
  planned_cfu: number
  exam_stats: {
    planned: number
    subscribed: number
    given: number
  }
}

const client = HttpClient.getInstance()

export const gradingbook = {
  getGradingBook(params: { matricola: string }, options?: RequestOptions) {
    const url = "/rest/me/polimi/" + params.matricola
    const request = client.callPolimi<Matters>({
      url,
      method: "GET",
      authType: AuthType.POLIMI,
      ...options,
    })
    return mapAxiosRequest(request, response => response)
  },
} satisfies ApiCollection
