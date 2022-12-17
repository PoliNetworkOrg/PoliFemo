import React from "react"

/* eslint-disable @typescript-eslint/naming-convention */
export interface PoliNetworkToken {
    access_token: string
    expires_in: number
    ext_expires_in: number
    id_token: string
    refresh_token: string
    scope: string
    token_type: string
}

export interface PolimiToken {
    accessToken: string
    expiresIn: number
    refreshToken: string
}

export interface Tokens {
    polimiToken: PolimiToken
    poliNetworkToken: PoliNetworkToken
}

export interface LoginState {
    loggedIn: boolean
    // TODO: this should be expanded with data connected to the user,
    // like name, student id, etc.
}

export type ILoginContext = LoginState & {
    setLoginState(newState: LoginState): void
}

export const LoginContext = React.createContext<ILoginContext>({
    loggedIn: false,
    setLoginState: () => null,
})
