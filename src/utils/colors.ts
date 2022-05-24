import { useColorScheme, ColorSchemeName } from "react-native"

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
     * Accent background color for stacked UI elements, such as cards.
     * It's a kind of lilac thing idk
     */
    backgroundAccent: string
    /**
     * Background for the home screen.
     * Lilac in light theme, veery deep blue in dark theme.
     */
    homeBackground: string
    /**
     * Primary color, used mostly in titles.
     * Deep blue in dark mode, kind of lilac in light mode.
     * Im not a designer i dont know colors
     */
    primary: string
    /**
     * Secondary color for accents, used in confirmation buttons.
     * Vibrant purple? Kinda?
     */
    secondary: string
    /**
     * Color for bulk text, e.g the body for an article.
     * Straight up black in dark mode, almost white in light mode.
     */
    text: string
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
 * to the [Figma project]{@link https://www.figma.com/file/ABlBGriBVZHRqGHwheQaVt/PoliFemo}
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
        /** the colors for the light theme, see {@link ColorTheme} */
        lightTheme: ColorTheme
        /** the colors for the dark theme, see {@link ColorTheme} */
        darkTheme: ColorTheme
    } = () => {
    const colorScheme = useColorScheme() ?? "light"

    const isDark = colorScheme === "dark"
    const isLight = !isDark

    const lightTheme: ColorTheme = {
        background: "#FFFFFF",
        backgroundAccent: "#DBDFF2",
        homeBackground: "#DBDFF2",
        primary: "#454773",
        secondary: "#726FBF",
        text: "#000000",
        buttonFill: "#F2F2F2",
        buttonText: "#454773",
    }

    const darkTheme: ColorTheme = {
        background: "#232A3E",
        backgroundAccent: "#677098",
        homeBackground: "#1B2132",
        primary: "#AFB5D9",
        secondary: "#726FBF",
        text: "#F9F9F9",
        buttonFill: "#AFB5D9",
        buttonText: "#454773",
    }

    const colors = isLight ? lightTheme : darkTheme

    return {
        ...colors,
        isLight,
        isDark,
        colorScheme,
        lightTheme,
        darkTheme,
    }
}
