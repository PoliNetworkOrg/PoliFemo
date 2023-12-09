import { User } from "api/collections/user"
import React from "react"

/* eslint-disable @typescript-eslint/naming-convention */

export type LoginState =
  | {
      loggedIn: false
      userInfo?: undefined
    }
  | {
      loggedIn: true
      userInfo: User
    }

export type ILoginContext = LoginState & {
  setLoginState(newState: LoginState): void
}

export const LoginContext = React.createContext<ILoginContext>({
  loggedIn: false,
  setLoginState: () => null,
})
