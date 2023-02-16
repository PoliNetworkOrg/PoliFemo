import React, { FC } from "react"
import { StyleSheet, TextProps } from "react-native"

import { usePalette } from "utils/colors"

import { BodyText } from "./BodyText"

/**
 * Just like the default react-native Text component, but with a custom font, and automatic color.
 * Used in text fields all over the app.
 */
export const Text: FC<TextProps> = props => {
  const { buttonText } = usePalette()
  let { style } = props
  style = StyleSheet.flatten(style) // so that we can override the fontWeight

  return (
    <BodyText
      {...props}
      style={[
        {
          fontWeight: "bold",
          fontSize: 16,
          color: buttonText,
        },
        style,
      ]}
    >
      {props.children}
    </BodyText>
  )
}
