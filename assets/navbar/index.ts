/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Home from "./home.svg"
import Back from "./back.svg"
import Down from "./down.svg"
import Sync from "./sync.svg"
import Add from "./add.svg"

/**
 * list of navbar icons
 */
export const navbarIconList = ["Home", "Back", "Add", "Sync", "Down"] as const

export type NavbarIcon = typeof navbarIconList[number]

/**
 * map with all the navbar icons in light and dark variety
 */
export const icons: { [key in NavbarIcon]: typeof Home } = {
    Home,
    Back,
    Down,
    Sync,
    Add,
}
