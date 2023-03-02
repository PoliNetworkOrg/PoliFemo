import React from "react"
import { Dimensions, StyleProp, View, ViewProps, ViewStyle } from "react-native"
import { getRadiiFromStyle } from "utils/layout"
import { BoxShadowCanvas, BoxShadowCanvasProps } from "./BoxShadowCanvas"

interface BoxShadowProps extends ViewProps {
  shadow: BoxShadowCanvasProps["shadow"]
  canvasStyle?: BoxShadowCanvasProps["canvasStyle"]
  overrideCanvasDimensions?: BoxShadowCanvasProps["canvasDimensions"]
  contentContainerStyle?: StyleProp<ViewStyle>
}

export const BoxShadowView: React.FC<BoxShadowProps> = ({
  shadow,
  canvasStyle,
  overrideCanvasDimensions,
  contentContainerStyle,
  children,
  ...props
}) => {
  const radii = getRadiiFromStyle(contentContainerStyle)

  return (
    <View {...props}>
      <BoxShadowCanvas
        shadow={shadow}
        canvasDimensions={{
          width: Dimensions.get("window").width,
          height: Math.max(...radii),
          radii,
          ...overrideCanvasDimensions,
        }}
        canvasStyle={[
          {
            marginTop: 1, // removes a 1px white line on the top of the canvas
          },
          canvasStyle,
        ]}
      />
      <View style={contentContainerStyle}>{children}</View>
    </View>
  )
}
