import React from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { getRadiiFromStyle } from "utils/layout"
import { BoxShadowCanvas } from "./BoxShadowCanvas"
import { BoxShadowViewProps } from "./BoxShadowView"

export type AdaptiveShadowViewProps = Omit<
  BoxShadowViewProps,
  "overrideCanvasDimensions"
>

/**
 * A view that renders a box shadow underneath a view.
 * This has dynamic dimensions calculated fron the content container's layout
 * event.
 * This is useful when the content container has dimensions that depend on its
 * content, and shadows need to be rendered all around.
 * This is not extremely performant, for upper border or known dimension
 * containers, prefer `{@link BoxShadowView}`.
 **/
export const AdaptiveShadowView: React.FC<AdaptiveShadowViewProps> = ({
  shadow,
  canvasStyle,
  contentContainerStyle,
  children,
  ...props
}) => {
  const ccstyle = StyleSheet.flatten(contentContainerStyle ?? {})
  const radii = getRadiiFromStyle(ccstyle)

  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)

  return (
    <View {...props}>
      <BoxShadowCanvas
        shadow={shadow}
        canvasDimensions={{
          width,
          height,
          radii,
        }}
        canvasStyle={[
          {
            marginTop: 1, // removes a 1px white line on the top of the canvas
          },
          canvasStyle,
        ]}
      />
      <Pressable
        onLayout={event => {
          const { width, height } = event.nativeEvent.layout
          setWidth(width)
          setHeight(height - 2)
        }}
        style={contentContainerStyle}
      >
        {children}
      </Pressable>
    </View>
  )
}
