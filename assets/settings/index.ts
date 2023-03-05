import { DataSourceParam } from "@shopify/react-native-skia"
import help from "./help.svg"
import modify from "./modify.svg"
import privacy from "./privacy.svg"
import disconnect from "./disconnect.svg"
import notifiche from "./notifiche.svg"

export const settingsIconList = [
  "notifiche",
  "privacy",
  "modify",
  "help",
  "disconnect",
] as const

export type SettingIconNames = (typeof settingsIconList)[number]

export interface IconProps {
  svg: DataSourceParam
  width: number
  heigth: number
}

export const settingsIcons: Record<SettingIconNames, number> = {
  notifiche,
  privacy,
  modify,
  help,
  disconnect,
}
