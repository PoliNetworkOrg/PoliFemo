import React, { FC } from "react"
import { Text as _Text, TextProps } from "react-native"

import { usePalette } from "utils/colors"

/**
 * Subtitle used for the Page component, custom font, default size and automatic color.
 */
export const Subtitle: FC<TextProps> = props => {
  const { primary } = usePalette()
  const { style, children } = props
  return (
    <_Text
      {...props}
      style={[
        {
          fontFamily: "Roboto_500Medium_Italic",
          fontSize: 24,
          color: primary,
          marginTop: -8,
        },
        style,
      ]}
    >
      {children}
    </_Text>
  )
}
