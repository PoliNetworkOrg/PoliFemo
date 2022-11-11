/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ImageSourcePropType } from "react-native"
import downloads from "./downloads.svg"
import notifications from "./notifications.svg"
import settings from "./settings.svg"

/**
 * list of tray icons
 */
export const trayIconList = ["downloads", "notifications", "settings"] as const

export type TrayIcon = typeof trayIconList[number]

export const trayIcons: Record<
    TrayIcon,
    { svg: ImageSourcePropType; width: number; heigth: number }
> = {
    downloads: {
        svg: downloads,
        width: 22,
        heigth: 23,
    },
    notifications: {
        svg: notifications,
        width: 31,
        heigth: 39,
    },
    settings: {
        svg: settings,
        width: 28,
        heigth: 29,
    },
}
