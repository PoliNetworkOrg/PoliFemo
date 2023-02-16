import React, { FC } from "react"
import { Animated, Easing, ViewStyle } from "react-native"
import { usePalette } from "utils/colors"

export interface AnimatedLineProps {
  /**
   * animate when this value changes
   */
  mounted: boolean
  color?: string
  height?: number
  width?: number
  style?: ViewStyle
}

export const AnimatedLine: FC<AnimatedLineProps> = props => {
  const { isLight } = usePalette()

  const { current: widthAnim } = React.useRef<Animated.Value>(
    new Animated.Value(1)
  )

  React.useEffect(() => {
    if (props.mounted) {
      Animated.timing(widthAnim, {
        toValue: 250,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(widthAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start()
    }
  }, [props.mounted])

  return (
    <Animated.View
      style={[
        {
          backgroundColor: isLight ? "#000" : "#8791BD",
          height: props.height ?? 1,
          width: widthAnim,
          alignSelf: "center",
        },
        props.style,
      ]}
    />
  )
}
