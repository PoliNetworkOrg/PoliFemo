/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import home from "./home.svg"
import back from "./back.svg"
import sync from "./sync.svg"
import add from "./add.svg"
import down from "./down.svg"

/**
 * list of navbar icons
 */
export const navbarIconList = ["home", "back", "add", "sync", "down"] as const

export type NavbarIcon = (typeof navbarIconList)[number]

export const navbarIcons: Record<NavbarIcon, number> = {
  home,
  back,
  add,
  sync,
  down,
}
