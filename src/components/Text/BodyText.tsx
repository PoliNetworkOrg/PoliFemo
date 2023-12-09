import { FC } from "react"
import { StyleSheet, Text as _Text, TextProps } from "react-native"

import { usePalette } from "utils/colors"

const fontweights: Record<string, string> = {
  /* eslint-disable @typescript-eslint/naming-convention */
  "900": "Roboto_900Black",
  bold: "Roboto_700Bold",
  "700": "Roboto_700Bold",
  "600": "Roboto_700Bold",
  "500": "Roboto_500Medium",
  normal: "Roboto_400Regular",
  "400": "Roboto_400Regular",
  "300": "Roboto_300Light",
  /* eslint-enable @typescript-eslint/naming-convention */
}

/**
 * Just like the default react-native Text component, but with a custom font, and automatic color.
 * Used in large bodies of text
 */
export const BodyText: FC<TextProps> = props => {
  const { bodyText } = usePalette()
  let { style } = props
  style = StyleSheet.flatten(style) // so that we can override the fontWeight

  const fontWeight = (style && style.fontWeight) || "normal"

  return (
    <_Text
      {...props}
      style={[
        {
          fontFamily: fontweights[fontWeight] ?? "Roboto_400Regular",
          fontSize: 16,
          color: bodyText,
        },
        style,
      ]}
    >
      {props.children}
    </_Text>
  )
}
