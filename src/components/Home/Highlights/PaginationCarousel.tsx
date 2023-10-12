import { FC } from "react"
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  interpolateColor,
} from "react-native-reanimated"
import { View, Dimensions } from "react-native"
import { CarouselItem } from "utils/carousel"
import { usePalette } from "utils/colors"

const { width } = Dimensions.get("window")

/**
 * Custom Pagination component to handle the animation of the dots
 */
export const PaginationCarousel: FC<{
  dataToShow: CarouselItem[]
  scrollX: SharedValue<number>
  currentIndex: number
}> = ({ dataToShow, scrollX, currentIndex }) => {
  const { palette } = usePalette()
  return (
    <View style={{ marginTop: 24 }}>
      <Animated.FlatList
        data={dataToShow}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        bounces={false}
        style={{
          flexDirection: "row",
          alignSelf: "center",
        }}
        renderItem={({ index }) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ]

          const scaleOutputRange = [0.5, 1, 0.5]
          const colorOutputRange = [
            palette.lighter,
            palette.accent,
            palette.lighter,
          ]

          const dotScale = interpolate(
            scrollX.value,
            inputRange,
            scaleOutputRange,
            Extrapolate.CLAMP
          )

          return (
            <View
              style={{
                width: 11,
              }}
            >
              <Animated.View
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 7,
                  backgroundColor:
                    index === currentIndex
                      ? interpolateColor(
                          scrollX.value,
                          [
                            (index - 0.5) * width,
                            index * width,
                            (index + 0.5) * width,
                          ],
                          colorOutputRange
                        )
                      : colorOutputRange[0],
                  transform: [
                    {
                      scale: dotScale,
                    },
                  ],
                }}
              />
            </View>
          )
        }}
      />
    </View>
  )
}
