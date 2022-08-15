import React, { FC } from "react"
import { StyleSheet, Text as _Text, TextProps } from "react-native"

import { usePalette } from "utils/colors"

/**
 * Just like the default react-native Text component, but with a custom font, and automatic color.
 * Used in large bodies of text
 */
export const BodyText: FC<TextProps> = props => {
    const { text } = usePalette()
    let { style } = props
    style = StyleSheet.flatten(style) // so that we can override the fontWeight

    const fontWeight = (style && style.fontWeight) || "normal"

    return (
        <_Text
            {...props}
            style={[
                {
                    fontFamily:
                        fontWeight === "900"
                            ? "Roboto_900Black"
                            : fontWeight === "bold" || fontWeight === "700"
                            ? "Roboto_700Bold"
                            : fontWeight === "300"
                            ? "Roboto_300Light"
                            : "Roboto_400Regular",
                    fontSize: 16,
                    color: text,
                },
                style,
            ]}
        >
            {props.children}
        </_Text>
    )
}
