import React, { FC } from "react"
import { createContext } from "react"
import { SettingsStateProps } from "./AppState"

export interface AppContextProps {
    state: SettingsStateProps
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AppContext = createContext<AppContextProps>({
    state: {
        theme: "Predefinito",
        setTheme: function (): void {
            throw new Error("error: function not set")
        },
    },
})

export interface AppStateProviderProps {
    children: React.ReactNode
    state: SettingsStateProps
}
/**
 * App state provider component. It will pass down to all its
 * descendants a state object whose props are defined
 * in {@link SettingsStateProps}
 */
export const AppStateProvider: FC<AppStateProviderProps> = props => {
    return (
        <AppContext.Provider value={{ state: props.state }}>
            {props.children}
        </AppContext.Provider>
    )
}
