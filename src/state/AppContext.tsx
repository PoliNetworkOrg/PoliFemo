import React, { FC } from "react"
import { createContext } from "react"
import { AppSettings } from "./AppSettings"

export interface AppContextProps {
    settings: AppSettings
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AppContext = createContext<AppContextProps>({
    settings: new AppSettings({ theme: "predefined" }),
    setSettings: function (): void {
        throw new Error("Debug")
    },
})

export interface AppStateProviderProps {
    children: React.ReactNode
    settings: AppSettings
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>
}
/**
 * App state provider component. It will pass down to all its
 * descendants a settings object {@link AppSettings}
 */
export const AppStateProvider: FC<AppStateProviderProps> = props => {
    return (
        <AppContext.Provider
            value={{ settings: props.settings, setSettings: props.setSettings }}
        >
            {props.children}
        </AppContext.Provider>
    )
}
