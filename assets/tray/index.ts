/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import downloads from "./downloads.svg"
import notifications from "./notifications.svg"
import settings from "./settings.svg"

/**
 * list of tray icons
 */
export const trayIconList = ["downloads", "notifications", "settings"] as const

export type TrayIcon = (typeof trayIconList)[number]

export const trayIcons: Record<TrayIcon, number> = {
  downloads,
  notifications,
  settings,
}
