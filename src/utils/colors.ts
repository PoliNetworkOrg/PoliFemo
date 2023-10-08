import { SettingsContext } from "contexts/settings"
import { useContext } from "react"
import { ColorSchemeName, useColorScheme } from "react-native"

export const palette = {
  primary: "#424967",
  lighter: "#8791BD",
  darker: "#232A3E",
  lessDark: "#2B344A",
  variant1: "#414867",
  variant2: "#010B40",
  variant3: "#454773",
  accent: "#FFB544",
  color1: "#9BC0D8",
  color2: "#F29999",
  widgetBgLighter: "#F6F7FC",
  widgetBgDarker: "#343E5A",
} as const

export type Palette = typeof palette

/**
 * Interface containing strings with the hex values for most used colors in the app, additional info
 * can be found as comments for each color.
 *
 * Due to a "technical limitation" (whatever that means) the dark mode is not available during debug.
 * So if you want to see the dark mode colors, shake the device in the expo app and click on
 * *"Stop Remote Debugging"*
 */
export interface ColorTheme {
  /**
   * Default background color for most UI views.
   * White in light mode, deep blue in dark mode.
   */
  background: string

  /**
   * Accent background color for stacked UI elements, a slightly lighter version of the background
   * color.
   */
  backgroundSecondary: string

  /**
   * Background for the home screen.
   * Lilac in light theme, deep blue in dark theme.
   */
  homeBackground: string

  /**
   * Primary color, used mostly in titles.
   * Deep blue in dark mode, orange in light mode.
   * Im not a designer i dont know colors
   */
  primary: string

  /**
   * Color for bulk text, e.g the body for an article.
   * Straight up black in dark mode, almost white in light mode.
   */
  bodyText: string

  /**
   * Fill color for most buttons that do not require sudden attention.
   * Gray in light mode, lilac again in dark mode.
   */
  buttonFill: string

  /**
   * Text color for most buttons.
   * Yeah that's purple i know this one.
   */
  buttonText: string

  /**
   * Fill color for the search button
   */
  fieldText: string

  /**
   * Darker in white mode, Lighter in dark mode background color, used in the text input fields.
   */
  fieldBackground: string

  /**
   * Fill color for modal barriers.
   * different shades of blue I guess
   */
  modalBarrier: string

  /**
   * Color for article title
   */
  articleTitle: string

  /**
   * Color for article subtitle
   */
  articleSubtitle: string

  /**
   * Dark blue used for the title in cards with a background image and a yellowish gradient.
   */
  cardTitle: string

  /**
   * for RoomDetails page's slider
   */
  sliderBorderColor: string

  /**
   * dark blue in light mode, white in dark mode, used in slider labels
   */
  labelsHighContrast: string

  /**
   * purple/blueish in light mode, white in dark mode, used in TimeLeftTile
   */
  iconHighContrast: string
}

/**
 * contains info about the color theme, taken from react-native's [useColorScheme hook](https://reactnative.dev/docs/usecolorscheme)
 */
export interface ColorSchemeInfo {
  /** true when in light mode */
  isLight: boolean
  /** true when in dark mode */
  isDark: boolean
  /** see {@link https://reactnative.dev/docs/usecolorscheme} */
  colorScheme: NonNullable<ColorSchemeName>
}

/**
 * Hook useful to get each color in the palette programmatically, so that they can be implemented
 * directly in the components.
 * It automatically handles light/dark mode, so no need to worry about that.
 *
 * For info about which color to use, see the specific descriptions in {@link ColorTheme} and refer
 * to the [Figma project]({@link https://www.figma.com/file/ABlBGriBVZHRqGHwheQaVt/PoliFemo})
 *
 * @returns an object that can be destructured to get the different colors
 *
 * @example The colors can be injected directly in the styles of the components.
 * ```tsx
 * const Component: FC = () => {
 *     const { background, primary } = useColors()
 *
 *     return <View style={{ backgroundColor: background }}>
 *         <Text style={{ fontSize: 40, color: primary }}>Hello</Text>
 *     </View>
 * }
 * ```
 *
 * @example You can also extract info about the color theme ({@link ColorSchemeInfo})
 * ```tsx
 * const { isLight, isDark, colorScheme } = useColors()
 * console.log("The color scheme is set to: " + colorScheme) // "dark" or "light"
 * if (isLight) {
 *    console.log("The color scheme is light")
 * }
 * // you get the gist of it
 * ```
 *
 * @example And you can access the light and dark theme at any point
 * ```tsx
 * const { lightTheme } = useColors()
 * const { background, primary } = lightTheme // those are the colors of the light theme only
 * ```
 */
export const usePalette: () => ColorTheme &
  ColorSchemeInfo & {
    /** object containing the colors of the palette */
    palette: Palette
    /** the colors for the light theme, see {@link ColorTheme} */
    lightTheme: ColorTheme
    /** the colors for the dark theme, see {@link ColorTheme} */
    darkTheme: ColorTheme
  } = () => {
  const context = useContext(SettingsContext)
  const chosenTheme = context.settings.theme

  let colorScheme = useColorScheme() ?? "light"
  if (chosenTheme !== "predefined") {
    colorScheme = chosenTheme
  }

  const isDark = colorScheme === "dark"
  const isLight = !isDark

  const lightTheme: ColorTheme = {
    background: "#FFFFFF",
    backgroundSecondary: "#FFFFFF",
    homeBackground: palette.primary, // "#424967",
    primary: palette.variant1, // "#414867",
    bodyText: "#000000",
    buttonFill: palette.primary, // "#424967",
    buttonText: "#FFFFFF",
    fieldText: palette.primary, //"#424967",
    fieldBackground: "#F6F7FC",
    modalBarrier: "rgba(1, 27, 41, 0.45)",
    articleTitle: palette.darker,
    articleSubtitle: palette.primary,
    cardTitle: palette.variant2, // "#010B40"
    sliderBorderColor: palette.variant3,
    labelsHighContrast: palette.variant1, // "#414867",
    iconHighContrast: palette.variant3, // "#454773",
  }

  const darkTheme: ColorTheme = {
    background: palette.darker, // "#232A3E",
    backgroundSecondary: palette.primary, // "#424967",
    homeBackground: palette.darker, // "#232A3E",
    primary: palette.accent, // "#FFB544",
    bodyText: "#FFFFFF",
    buttonFill: palette.lighter, // "#8791BD",
    buttonText: "#FFFFFF",
    fieldText: "#D4D4D4",
    fieldBackground: "#343E5A",
    modalBarrier: "rgba(1, 27, 41, 0.6)",
    articleTitle: "#FFFFFF",
    articleSubtitle: palette.lighter,
    cardTitle: palette.variant2, // "#010B40"
    sliderBorderColor: "#FFFFFF",
    labelsHighContrast: "#FFFFFF",
    iconHighContrast: "#FFFFFF",
  }

  const colors = isLight ? lightTheme : darkTheme

  return {
    ...colors,
    isLight,
    isDark,
    colorScheme,
    lightTheme,
    darkTheme,
    palette,
  }
}
