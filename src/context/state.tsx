import React, { FC } from "react"
import { createContext } from "react"

export interface AppContextProps {
    state: {
        theme: string
        setTheme: React.Dispatch<React.SetStateAction<string>>
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AppContext = createContext<AppContextProps>({
    state: {
        theme: "Predefinito",
        setTheme: function (): void {
            throw new Error("Function not implemented.")
        },
    },
})

export interface AppStateProviderProps {
    children: React.ReactNode
    state: {
        theme: string
        setTheme: React.Dispatch<React.SetStateAction<string>>
    }
}

export const AppStateProvider: FC<AppStateProviderProps> = props => {
    return (
        <AppContext.Provider value={{ state: props.state }}>
            {props.children}
        </AppContext.Provider>
    )
}
