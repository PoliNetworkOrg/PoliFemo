import { PolimiToken } from "utils/login"
import { client, AuthType, RequestOptions } from "./httpClient"

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

    /**
     * test PoliNetwork auth call
     */
    async getPolinetworkMe() {
        const response = await client.poliNetworkInstance.get<{
            id: string
        }>("/v1/accounts/me", {
            authType: AuthType.POLINETWORK,
        })
        return response.data
    },
    /**
     * test polimi auth call
     */
    async getPolimiUserInfo() {
        const response = await client.polimiInstance.get<{
            idPersona: number
            codicePersona: string
            nome: string
            cognome: string
            matricola: string
            classeCarriera: string
            description: string
            initials: string
            email: string
            fotoURL: string
        }>("/internal/user", {
            authType: AuthType.POLIMI,
        })
        return response.data
    },
}
