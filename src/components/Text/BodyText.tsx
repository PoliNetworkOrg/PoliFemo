import React, { FC } from "react"
import { StyleSheet, Text as _Text, TextProps } from "react-native"
import { usePalette } from "../../utils/colors"

/**
 * Just like the default react-native Text component, but with a custom font, and automatic color.
 * Used in large bodies of text
 */
export const BodyText: FC<TextProps> = props => {
    const { text } = usePalette()
    let { style } = props
    style = StyleSheet.flatten(style) // so that we can override the fontWeight

    return (
        <_Text
            {...props}
            style={[
                {
                    fontFamily:
                        style && style.fontWeight === "bold"
                            ? "Roboto_900Black"
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
