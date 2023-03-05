import { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler"
import { getCrowdStatus } from "utils/rooms"

interface CrowdSliderDynamicProps {
  usableWidth?: number
  startingPos: number
  onSlideEnd: (pos: number) => void
}

export const CrowdSliderDynamic: FC<CrowdSliderDynamicProps> = props => {
  const { sliderBorderColor } = usePalette()

  const wrapper = (pos: number, width: number) => {
    const crowdStatus = getCrowdStatus(pos, width)
    if (props.onSlideEnd) {
      props.onSlideEnd(crowdStatus)
    }
  }
  const circleWidth = 28

  //320 is modal width, 52 is content padding
  const usableWidth = props.usableWidth ?? 320 - 52 - circleWidth

  const startingPos = ((props.startingPos - 1) / 4) * usableWidth

  const position = useSharedValue(startingPos)
  const lastPosition = useSharedValue(startingPos)
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      const newPos = e.translationX + lastPosition.value
      position.value = newPos
      if (newPos < 0) {
        position.value = 0
      } else if (newPos > usableWidth) {
        position.value = usableWidth
      }
    })
    .onEnd(() => {
      lastPosition.value = position.value
      runOnJS(wrapper)(position.value, usableWidth)
    })

  const animatedPos = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }))

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          position: "absolute",
          borderBottomWidth: 0.5,
          width: "100%",
          borderColor: sliderBorderColor,
          marginTop: 15,
          marginBottom: 18,
        }}
      />

      <GestureHandlerRootView style={{ backgroundColor: "transparent" }}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                width: 28,
                height: 28,
                backgroundColor: "#D9D9D9",
                borderRadius: 14,
              },
              animatedPos,
            ]}
          />
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  )
}
