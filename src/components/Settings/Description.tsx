import React from "react"
import { BodyText } from "components/Text"
import { usePalette } from "utils/colors"

interface DescriptionProps {
  last?: boolean
  children: React.ReactNode
}

export const Description: React.FC<DescriptionProps> = props => {
  const { articleSubtitle, palette, isLight } = usePalette()
  return (
    <BodyText
      style={{
        paddingHorizontal: 32,
        fontSize: 14,
        color: articleSubtitle,
        paddingTop: 8,
        paddingBottom: props.last ? 80 : 32,
        backgroundColor: isLight ? "#F6F7FC" : palette.lessDark,
      }}
    >
      {props.children}
    </BodyText>
  )
}
