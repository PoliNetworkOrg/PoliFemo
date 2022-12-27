import React from "react"
import { ValidColorSchemeName } from "utils/settings"

/**
 * Context for Theme Selector radio button group
 */
export interface ThemeSelectorProps {
    theme: ValidColorSchemeName
    setTheme: React.Dispatch<React.SetStateAction<ValidColorSchemeName>>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ThemeSelectorContext = React.createContext<ThemeSelectorProps>({
    theme: "predefined",
    setTheme: () => null,
})

/**
 * Context for general purpose radio button group
 */
export interface RadioButtonGroupProps {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const RadioButtonGroup = React.createContext<RadioButtonGroupProps>({
    value: "prova",
    setValue: () => null,
})
