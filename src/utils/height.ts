import { Dimensions, Platform } from "react-native"
import { getStatusBarHeight } from "react-native-status-bar-height"

/**
 * Function to get the usable screen height (screen height including translucent status bar,
 * but excluding the android bottom navigation bar).
 *
 * Can't use directly "Dimensions.get("window").height" because sometimes it includes the
 * translucent status bar, sometimes it doesn't.
 *
 * TODO: if there is a better native function to get this dimension, use it. I didn't find anything better.
 */
export const getUsableScreenHeight: () => number = () => {
    const windowHeight = Dimensions.get("window").height
    const screenHeight = Dimensions.get("screen").height
    const statusBarHeight = getStatusBarHeight()
    const minBottomBarHeight = 40 // usually the height of the android bottom bar is 42px or 48px

    // On IOS window height should always include the status bar height.
    if (Platform.OS === "ios") {
        return windowHeight
    }

    // On ANDROID if you take the whole ScreenHeight, you subtract the WindowHeight
    // and the StatusbarHeight, and there is not enough space left for the bottom bar,
    // it means that the WindowHeight already includes the StatusbarHeight.
    if (screenHeight - windowHeight - statusBarHeight < minBottomBarHeight) {
        return windowHeight
    }

    // ANDROID if Window height doesn't already include the status bar height.
    return windowHeight + statusBarHeight

    // TODO: test on an old devide that doesn't have a traslucent status bar
}
