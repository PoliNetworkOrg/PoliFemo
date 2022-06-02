/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ColorSchemeName, ImageSourcePropType } from "react-native"

import homelight from "./home-light.png"
import homedark from "./home-dark.png"
import backlight from "./back-light.png"
import backdark from "./back-dark.png"
import downlight from "./down-light.png"
import downdark from "./down-dark.png"
import synclight from "./sync-light.png"
// import syncdark from "./sync-dark.png"
import addlight from "./add-light.png"
// import adddark from "./add-dark.png"

import { usePalette } from "../../src/utils/colors"

/**
 * list of navbar icons
 */
export const navbarIconList = ["home", "back", "add", "sync", "down"] as const

export type NavbarIcon = typeof navbarIconList[number]

type IconName = `${NavbarIcon}-${NonNullable<ColorSchemeName>}`

/**
 * map with all the navbar icons in light and dark variety
 */
export const icons: { [key in IconName]: ImageSourcePropType } = {
    "home-light": homelight,
    "home-dark": homedark,
    "back-light": backlight,
    "back-dark": backdark,
    "down-light": downlight,
    "down-dark": downdark,
    "sync-light": synclight,
    "sync-dark": synclight, // TODO: sync-dark
    "add-light": addlight,
    "add-dark": addlight, // TODO: add-dark
}

/**
 * this hook returns the icon prop for the given name, using the right color scheme
 * @param iconName name if the icon from {@link navbarIconList}
 * @returns the icon to be passed to an Image source
 */
export const useNavbarIcon: (
    iconName: NavbarIcon
) => ImageSourcePropType = iconName => {
    const { colorScheme } = usePalette()
    const icon = icons[`${iconName}-${colorScheme}`] ?? homelight
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return icon // this makes no sense it shouldn't be any but idk, it works
}
