import {
  Dimensions,
  Platform,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native"
import { getStatusBarHeight } from "react-native-status-bar-height"

/**
 * Function to get the usable screen height (screen height including translucent status bar,
 * but excluding the android bottom navigation bar).
 *
 * Can't use directly "Dimensions.get("window").height" because of a bug:
 * on Android sometimes it includes the translucent status bar, sometimes it doesn't.
 *
 * TODO: Another way to get this dimension would be to get the height of the root View component of the app
 * using the onLayout prop, and then put that value in a context so that it can be used everywhere
 */
export const getUsableScreenHeight: () => number = () => {
  const windowHeight = Dimensions.get("window").height
  const screenHeight = Dimensions.get("screen").height
  const statusBarHeight = getStatusBarHeight()
  const minBottomBarHeight = 40 // usually the height of the android bottom bar is 42px or 48px

  // On IOS the WindowHeight always include the StatusbarHeight
  if (Platform.OS === "ios") {
    return windowHeight
  }

  // On ANDROID if you take the whole ScreenHeight, you subtract the WindowHeight
  // and the StatusbarHeight, and there is not enough space left for the bottom navigation bar,
  // it means that the WindowHeight already includes the StatusbarHeight
  if (screenHeight - windowHeight - statusBarHeight < minBottomBarHeight) {
    return windowHeight
  }

  // ANDROID if the WindowHeight doesn't already include the StatusBarHeight
  return windowHeight + statusBarHeight
}

/**
 * Extract the radii from the varius borderRadius properties in the sytl prop,
 * and return them in an array of 4 numbers
 * @param styleProp the style prop of the view to get the radii from
 * @returns an array of 4 numbers representing the radii of the view, from top
 * left to bottom left in clockwise order
 */
export function getRadiiFromStyle(styleProp: StyleProp<ViewStyle>) {
  const style = StyleSheet.flatten(styleProp)
  const radii: [number, number, number, number] = [0, 0, 0, 0]

  if (style.borderRadius) {
    radii[0] = style.borderRadius
    radii[1] = style.borderRadius
    radii[2] = style.borderRadius
    radii[3] = style.borderRadius
  }

  if (style.borderTopStartRadius) {
    radii[0] = style.borderTopStartRadius
  }
  if (style.borderTopEndRadius) {
    radii[1] = style.borderTopEndRadius
  }
  if (style.borderBottomEndRadius) {
    radii[2] = style.borderBottomEndRadius
  }
  if (style.borderBottomStartRadius) {
    radii[3] = style.borderBottomStartRadius
  }

  if (style.borderTopLeftRadius) {
    radii[0] = style.borderTopLeftRadius
  }
  if (style.borderTopRightRadius) {
    radii[1] = style.borderTopRightRadius
  }
  if (style.borderBottomRightRadius) {
    radii[2] = style.borderBottomRightRadius
  }
  if (style.borderBottomLeftRadius) {
    radii[3] = style.borderBottomLeftRadius
  }
  return radii
}
