import React, { FC } from "react"
import { Text as _Text, TextProps } from "react-native"

import { usePalette } from "utils/colors"

/**
 * Title used in cards with a background image and a yellowish gradient,
 * custom font, default size and automatic color.
 */
export const CardTitle: FC<TextProps> = props => {
  const { cardTitle } = usePalette()
  const { style, children } = props
  return (
    <_Text
      {...props}
      style={[
        {
          fontFamily: "Roboto_900Black",
          fontSize: 16,
          color: cardTitle,
        },
        style,
      ]}
    >
      {children}
    </_Text>
  )
}
