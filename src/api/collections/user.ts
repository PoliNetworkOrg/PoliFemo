import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"
import { HttpClient, AuthType, RetryType, RequestOptions } from "../HttpClient"
/**
 * Interface of UI User Object.
 */
export interface User {
  codPersona: string
  careers: Career[]
  firstname: string
  lastname: string
  profilePic?: string
  userID: string
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

interface PoliNetworkSettings {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  expire_in_days: number
}

const client = HttpClient.getInstance()

/**
 * Collection of endpoints related to User
 */
export const user = {
  /**
   * Get the user's settings from PoliNetwork
   * @returns Settings of the user
   */
  getPoliNetworkSettings(
    _params?: Record<string, never>,
    options?: RequestOptions
  ) {
    const request = client.callPoliNetwork<PoliNetworkSettings>({
      url: "/v1/accounts/me/settings",
      method: "GET",
      authType: AuthType.POLINETWORK,
      ...options,
    })
    return mapAxiosRequest(request, res => res)
  },

  /**
   * Update PoliNetwork user settings
   * @param settings new settings to be saved
   */
  updatePoliNetworkSettings(
    params: {
      settings: Partial<PoliNetworkSettings>
    },
    options?: RequestOptions
  ) {
    const request = client.callPoliNetwork({
      url: "/v1/accounts/me/settings",
      method: "POST",
      data: params.settings,
      authType: AuthType.POLINETWORK,
      retryType: RetryType.NO_RETRY,
      ...options,
    })
    return mapAxiosRequest(request, res => res)
  },

  /**
   * test PoliNetwork auth call
   */
  getPoliNetworkMe(_params?: Record<string, never>, options?: RequestOptions) {
    const request = client.callPoliNetwork<{
      id: string
    }>({
      url: "/v1/accounts/me",
      method: "GET",
      authType: AuthType.POLINETWORK,
      ...options,
    })
    return mapAxiosRequest(request, res => res)
  },

  /**
   * test polimi auth call
   */
  getPolimiUserInfo(_params?: Record<string, never>, options?: RequestOptions) {
    const request = client.callPolimi<PolimiUserData>({
      url: "/rest/jaf/internal/user",
      method: "GET",
      authType: AuthType.POLIMI,
      ...options,
    })
    return mapAxiosRequest(request, res => res)
  },

  /**
   * Get a file with all of the user's data
   */
  exportPoliNetworkMe(
    _params?: Record<string, never>,
    options?: RequestOptions
  ) {
    const request = client.callPoliNetwork<Record<string, unknown>>({
      url: "/v1/accounts/me/export",
      method: "GET",
      authType: AuthType.POLINETWORK,
      ...options,
    })
    return mapAxiosRequest(request, res => res)
  },
  /**
   * Delete the user's account and data
   */
  deletePoliNetworkMe(
    _params?: Record<string, never>,
    options?: RequestOptions
  ) {
    const request = client.callPoliNetwork({
      url: "/v1/accounts/me",
      method: "DELETE",
      authType: AuthType.POLINETWORK,
      ...options,
    })
    return mapAxiosRequest(request, res => res)
  },
} satisfies ApiCollection
