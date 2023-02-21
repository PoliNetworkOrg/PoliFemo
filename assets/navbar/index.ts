/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DataSourceParam } from "@shopify/react-native-skia"
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

export const navbarIcons: Record<
  NavbarIcon,
  { svg: DataSourceParam; width: number; heigth: number }
> = {
  home: {
    svg: home,
    width: 18,
    heigth: 19,
  },
  back: {
    svg: back,
    width: 12,
    heigth: 11,
  },
  add: {
    svg: add,
    width: 17,
    heigth: 17,
  },
  sync: {
    svg: sync,
    width: 18,
    heigth: 19,
  },
  down: {
    svg: down,
    width: 12,
    heigth: 13,
  },
}

/**
 * map with all the navbar icons in light and dark variety
 */
// export const icons: { [key in NavbarIcon]: typeof Home } = {
//     Home,
//     Back,
//     Down,
//     Sync,
//     Add,
// }
