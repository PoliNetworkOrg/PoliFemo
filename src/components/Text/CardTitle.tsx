import { FC } from "react"
import { TextProps } from "react-native"

import { usePalette } from "utils/colors"
import { BodyText } from "./BodyText"

/**
 * Title used in cards with a background image and a yellowish gradient,
 * custom font, default size and automatic color.
 */
export const CardTitle: FC<TextProps> = props => {
  const { cardTitle } = usePalette()
  const { style, children } = props
  return (
    <BodyText
      {...props}
      style={[
        {
          fontWeight: "900",
          fontSize: 16,
          color: cardTitle,
        },
        style,
      ]}
    >
      {children}
    </BodyText>
  )
}
