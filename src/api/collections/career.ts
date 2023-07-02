import { AuthType, HttpClient, RequestOptions } from "api/HttpClient"
import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"

/* eslint-disable @typescript-eslint/naming-convention */
export type CareerStats = {
  mean: number
  given_cfu: number
  planned_cfu: number
  exam_stats: {
    planned: number
    subscribed: number
    given: number
  }
}
/* eslint-disable @typescript-eslint/naming-convention */

const client = HttpClient.getInstance()

export const career = {
  /**
   * Retrieves the career statistics of the user from Polimi server.
   * Info includes the mean, the given cfu, the planned cfu and the exam stats.
   */
  getCareer(params: { matricola: string }, options?: RequestOptions) {
    const url = `/rest/me/polimi/${params.matricola}`
    const request = client.callPolimi<CareerStats>({
      url,
      method: "GET",
      authType: AuthType.POLIMI,
      ...options,
    })
    return mapAxiosRequest(request, response => response)
  },
} satisfies ApiCollection
