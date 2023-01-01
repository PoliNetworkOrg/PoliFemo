import { PolimiToken } from "utils/login"
import { client, RequestOptions } from "./httpClient"

/**
 * Collection of endpoints related to authentication
 */
export const auth = {
    /**
     * gets the OAuth access token given the polimi authcode from the login flow
     * @param code Polimi AuthCode
     * @returns polimi accessToken and refreshToken
     */
    async getPolimiToken(code: string, options?: RequestOptions) {
        const response = await client.polimiInstance.get<PolimiToken>(
            `/oauth/token/get/${code}`,
            {
                ...options,
                headers: {
                    accept: "application/json",
                },
            }
        )
        return response.data
    },
}
