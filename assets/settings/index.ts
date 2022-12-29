import { ImageSourcePropType } from "react-native"
import help from "./help.svg"
import modify from "./modify.svg"
import disconnect from "./disconnect.svg"
import notifiche from "./notifiche.svg"

export const settingsIconList = [
    "notifiche",
    "modify",
    "help",
    "disconnect",
] as const

export type SettingIconNames = typeof settingsIconList[number]

export interface IconProps {
    svg: ImageSourcePropType
    width: number
    heigth: number
}

export const settingsIcons: Record<SettingIconNames, IconProps> = {
    notifiche: {
        svg: notifiche,
        width: 20,
        heigth: 24,
    },
    modify: {
        svg: modify,
        width: 20,
        heigth: 20,
    },
    help: {
        svg: help,
        width: 24,
        heigth: 24,
    },
    disconnect: {
        svg: disconnect,
        width: 24,
        heigth: 24,
    },
}
