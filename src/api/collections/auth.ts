import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"
import { PolimiToken } from "contexts/login"
import { HttpClient, RequestOptions } from "../HttpClient"

const client = HttpClient.getInstance()

/**
 * Collection of endpoints related to authentication
 */
export const auth = {
  /**
   * gets the OAuth access token given the polimi authcode from the login flow
   * @param code Polimi AuthCode
   * @returns polimi accessToken and refreshToken
   */
  getPolimiToken(params: { authcode: string }, options?: RequestOptions) {
    const request = client.callPolimi<PolimiToken>({
      url: `/rest/jaf/oauth/token/get/${params.authcode}`,
      method: "GET",
      ...options,
      headers: {
        accept: "application/json",
      },
    })
    return mapAxiosRequest(request, res => res)
  },
  getPolimiExamsToken(params: { authcode: string }, options?: RequestOptions) {
    const request = client.callPolimiExams<PolimiToken>({
      url: `/rest/jaf/oauth/token/get/${params.authcode}`,
      method: "GET",
      ...options,
      headers: {
        accept: "application/json",
      },
    })
    return mapAxiosRequest(request, res => res)
  },
} satisfies ApiCollection
