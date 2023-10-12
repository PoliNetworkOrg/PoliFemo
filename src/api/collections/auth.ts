import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"
import { HttpClient, RequestOptions } from "../HttpClient"
import { polimiTokenSchema } from "api/schemas"

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
    const request = client.callPolimi({
      url: `/rest/jaf/oauth/token/get/${params.authcode}`,
      method: "GET",
      headers: {
        accept: "application/json",
      },
      zodSchema: polimiTokenSchema,
      ...options,
    })
    return mapAxiosRequest(request, res => res)
  },
} satisfies ApiCollection
