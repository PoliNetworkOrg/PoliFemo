import { DataSourceParam } from "@shopify/react-native-skia"
import upload from "./upload.svg"
import associazioni from "./associazioni.svg"
import comunicazioni from "./comunicazioni.svg"

export const notificationsIconList = [
  "upload",
  "associazioni",
  "comunicazioni",
] as const

export type NotificationIconNames = (typeof notificationsIconList)[number]

export interface IconProps {
  svg: DataSourceParam
  width: number
  heigth: number
}

export const notificationsIcons: Record<NotificationIconNames, number> = {
  upload,
  associazioni,
  comunicazioni,
}
