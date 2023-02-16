import React, { FC } from "react"
import { View, ViewStyle } from "react-native"

export interface DividerProps {
  color?: string
  height?: number
  width?: number
  style?: ViewStyle
}

export const Divider: FC<DividerProps> = props => {
  return (
    <View
      style={[
        {
          backgroundColor: props.color ?? "#8791BD",
          height: props.height ?? 1,
          width: props.width ?? "100%",
        },

        props.style,
      ]}
    />
  )
}
