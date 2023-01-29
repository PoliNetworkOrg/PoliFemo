import { DataSourceParam } from "@shopify/react-native-skia"
import whatsapp from "./whatsapp.svg"
import facebook from "./facebook.svg"
import telegram from "./telegram.svg"

/**
 * list of tray icons
 */
export const platformIconList = ["telegram", "whatsapp", "facebook"] as const

export type PlatformIcon = typeof platformIconList[number]

export const platformIcons: Record<
    PlatformIcon,
    { svg: DataSourceParam; width: number; heigth: number }
> = {
    whatsapp: {
        svg: whatsapp,
        width: 24,
        heigth: 24,
    },
    telegram: {
        svg: telegram,
        width: 24,
        heigth: 24,
    },
    facebook: {
        svg: facebook,
        width: 24,
        heigth: 24,
    },
}