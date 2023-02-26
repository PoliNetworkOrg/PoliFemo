import React from "react"
import { StyleProp, View, ViewProps, ViewStyle } from "react-native"
import { BoxShadowCanvas, BoxShadowCanvasProps } from "./BoxShadowCanvas"

interface BoxShadowProps extends ViewProps {
  shadow: BoxShadowCanvasProps["shadow"]
  canvasStyle?: BoxShadowCanvasProps["canvasStyle"]
  contentContainerStyle?: StyleProp<ViewStyle>
}

export const BoxShadowView: React.FC<BoxShadowProps> = ({
  shadow,
  canvasStyle,
  contentContainerStyle,
  children,
  ...props
}) => {
  return (
    <View {...props}>
      <BoxShadowCanvas
        shadow={shadow}
        canvasStyle={canvasStyle}
        siblingViewStyle={contentContainerStyle}
      />
      <View style={contentContainerStyle}>{children}</View>
    </View>
  )
}
