import { FC } from "react"
import { StyleSheet, Text as _Text, TextProps } from "react-native"

import { usePalette } from "utils/colors"

const fontweights: Record<string, string> = {
  /* eslint-disable @typescript-eslint/naming-convention */
  "900": "Poppins_900Black",
  bold: "Poppins_700Bold",
  "700": "Poppins_700Bold",
  "600": "Poppins_700Bold",
  "500": "Poppins_500Medium",
  normal: "Poppins_400Regular",
  "400": "Poppins_400Regular",
  "300": "Poppins_300Light",
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
          fontFamily: fontweights[fontWeight] ?? "Poppins_400Regular",
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
