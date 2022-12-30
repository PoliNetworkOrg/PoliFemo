import AsyncStorage from "@react-native-async-storage/async-storage"
import { PolimiToken, Tokens } from "utils/login"
import {
    api,
    AuthType,
    defaultReqOptions,
    loadTokens,
    refreshPolimiToken,
    refreshPoliNetworkToken,
    RequestOptions,
} from "./HttpClient"

/**
 * Api Object that serves as a collection of calls related to authentication
 */
export const authApi = {
    /**
     * gets the OAuth access token given the polimi authcode from the login flow
     * @param code Polimi AuthCode
     * @returns polimi accessToken and refreshToken
     */
    async getPolimiToken(code: string, options?: RequestOptions) {
        options = options ?? defaultReqOptions
        const response = await api.polimiInstance.get<PolimiToken>(
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
     * set the tokens and save them to storage
     * @param tokens both the polinetwork and polimi tokens
     */
    async setTokens(tokens: Tokens) {
        api.polimiToken = tokens.polimiToken
        api.poliNetworkToken = tokens.poliNetworkToken

        api.emit("login")
        api.emit("login_event", true)

        // save the tokens in local storage
        await AsyncStorage.setItem("api:tokens", JSON.stringify(tokens))
        console.log("Saved tokens in local storage")
    },
    /**
     * remove the tokens from storage, essentially log out
     */
    async destroyTokens() {
        console.log("Destroying tokens, logging out")

        api.polimiToken = undefined
        api.poliNetworkToken = undefined

        api.emit("logout")
        api.emit("login_event", false)

        // remove the tokens from local storage
        await AsyncStorage.removeItem("api:tokens")
    },

    /**
     * test PoliNetwork auth call
     */
    async getPolinetworkMe() {
        const response = await api.poliNetworkInstance.get<{
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
        const response = await api.polimiInstance.get<{
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
    /**
     * refresh the polimi token, returns the success value
     * @returns true if the token was refreshed, false otherwise
     */
    refreshPolimiToken: refreshPolimiToken,

    refreshPoliNetworkToken: refreshPoliNetworkToken,

    /**
     * load tokens from storage on boot, if they aren't present, do nothing
     */
    loadTokens: loadTokens,
}
