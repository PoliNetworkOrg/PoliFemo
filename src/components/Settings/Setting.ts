import { IconProps } from "assets/settings"

export interface Setting {
    title: string
    subtitle?: string
    icon?: IconProps
    callback?: () => void
}
