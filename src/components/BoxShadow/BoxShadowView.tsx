import React from "react"
import {
  Dimensions,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"
import { getRadiiFromStyle } from "utils/layout"
import { BoxShadowCanvas, BoxShadowCanvasProps } from "./BoxShadowCanvas"

export interface BoxShadowViewProps extends ViewProps {
  shadow: BoxShadowCanvasProps["shadow"]
  canvasStyle?: BoxShadowCanvasProps["canvasStyle"]
  overrideCanvasDimensions?: BoxShadowCanvasProps["canvasDimensions"]
  contentContainerStyle?: StyleProp<ViewStyle>
  onPress?: () => void
}

/**
 * A view that renders a box shadow on the upper corner of the view.
 * This has static dimensions for performance reasons, defaults to the width of
 * the screen and the minimum height to contain all corner radii.
 * To use custom dimensions, use `{@link overrideCanvasDimensions}`.
 *
 * If you need to render a shadow on a view with dynamic dimensions, use
 * `{@link AdaptiveShadowView}`.
 */
export const BoxShadowView: React.FC<BoxShadowViewProps> = ({
  shadow,
  canvasStyle,
  overrideCanvasDimensions,
  contentContainerStyle,
  onPress,
  children,
  ...props
}) => {
  const ccstyle = StyleSheet.flatten(contentContainerStyle ?? {})
  const radii = getRadiiFromStyle(ccstyle)

  return (
    <View {...props}>
      <BoxShadowCanvas
        shadow={shadow}
        canvasDimensions={{
          width: Dimensions.get("window").width,
          height: Math.max(radii[0], radii[1]) + Math.max(radii[2], radii[3]),
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
      <Pressable onPress={onPress} style={contentContainerStyle}>
        {children}
      </Pressable>
    </View>
  )
}
