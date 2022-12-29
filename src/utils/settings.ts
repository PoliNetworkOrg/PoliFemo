import React from "react"
import { ColorSchemeName } from "react-native"
import { IconProps } from "assets/settings"

/**
 * interface representing a setting's UI fields
 */
export interface SettingOptions {
    title: string
    subtitle?: string
    icon?: IconProps
    callback?: () => void
}
/**
 * `"predefined"` or `"light"` or `"dark"`
 */
export type ValidColorSchemeName = NonNullable<ColorSchemeName> | "predefined"

export interface Settings {
    theme: ValidColorSchemeName
}
export interface SettingsContextProps {
    settings: Settings
    setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SettingsContext = React.createContext<SettingsContextProps>({
    settings: { theme: "predefined" },
    setSettings: () => null,
})
