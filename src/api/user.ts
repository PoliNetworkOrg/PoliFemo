import { HttpClient, AuthType } from "./HttpClient"
/**
 * Interface of UI User Object.
 */
export interface User {
    codPersona: string
    careers: Career[]
    firstname: string
    lastname: string
    profilePic?: string
}

export interface Career {
    matricola: string
    type?: string // Visitatore - Studente - Studente - titolo conseguito
}

/**
 * Interface of user data object retrieved from Polimi's server.
 */
export interface PolimiUserData {
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
}

const client = HttpClient.getInstance()

/**
 * Collection of endpoints related to User
 */
export const user = {
    /**
     * test PoliNetwork auth call
     */
    async getPoliNetworkMe() {
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
        const response = await client.polimiInstance.get<PolimiUserData>(
            "/rest/jaf/internal/user",
            {
                authType: AuthType.POLIMI,
            }
        )
        return response.data
    },
    /**
     * Get a file with all of the user's data
     */
    async exportPoliNetworkMe() {
        const response = await client.poliNetworkInstance.get<
            Record<string, unknown>
        >("/v1/accounts/me/export", {
            authType: AuthType.POLINETWORK,
        })
        return response.data
    },
    /**
     * Delete the user's account and data
     */
    async deletePoliNetworkMe() {
        await client.poliNetworkInstance.delete("/v1/accounts/me", {
            authType: AuthType.POLINETWORK,
        })
    },
}
