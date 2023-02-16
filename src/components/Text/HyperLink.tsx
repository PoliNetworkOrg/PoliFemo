import React, { FC } from "react"
import { Text, Linking, TextProps } from "react-native"
import { usePalette } from "utils/colors"

type HyperLinkProps = {
  onPress?: () => void
  href?: string
  children: React.ReactNode
} & TextProps

export const HyperLink: FC<HyperLinkProps> = props => {
  const { palette } = usePalette()
  return (
    <Text
      {...props}
      style={[{ color: palette.accent }, props.style]}
      onPress={
        props.onPress ??
        (async () => {
          const canOpen = await Linking.canOpenURL(props.href ?? "")
          if (canOpen) await Linking.openURL(props.href ?? "")
        })
      }
    >
      {props.children}
    </Text>
  )
}
