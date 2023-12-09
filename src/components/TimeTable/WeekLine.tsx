import { BodyText } from "components/Text"
import { FC } from "react"
import { View } from "react-native"
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated"
import { useCurrentLanguage } from "utils/language"
import { usePalette } from "utils/colors"

interface WeekLineProps {
  overlapsNumberList: number[]
  overlapsNumberListCollapsed: number[]
  animatedValue: SharedValue<number>
}

export const WeekLine: FC<WeekLineProps> = props => {
  const { isLight, primary } = usePalette()

  const language = useCurrentLanguage()
  const days =
    language == "it"
      ? ["L", "M", "M", "G", "V", "S"]
      : ["M", "T", "W", "T", "F", "S"]

  const heightStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        props.animatedValue.value,
        [-1, 0],
        [props.overlapsNumberList[6], props.overlapsNumberListCollapsed[6]]
      ),
      marginBottom: interpolate(props.animatedValue.value, [-1, 0], [100, 350]),
    }
  }, [
    props.animatedValue,
    props.overlapsNumberList,
    props.overlapsNumberListCollapsed,
  ])

  const animatedStyles = new Array(7).fill(0).map((_, index) => {
    return useAnimatedStyle(() => {
      const top = interpolate(
        props.animatedValue.value,
        [-1, 0],
        [
          props.overlapsNumberList[index] - 4,
          props.overlapsNumberListCollapsed[index] - 4,
        ]
      )

      return { top }
    }, [
      props.animatedValue,
      props.overlapsNumberList,
      props.overlapsNumberListCollapsed,
    ])
  })

  return (
    <View style={{ flexDirection: "row", marginTop: 34 }}>
      <Animated.View
        style={[
          {
            flexDirection: "column",
            borderRightWidth: 1,
            borderColor: isLight ? primary : "white",
            padding: 10,
            marginLeft: 28,
          },
          heightStyle,
        ]}
      >
        {days.map((item, index) => (
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
              },
              animatedStyles[index],
            ]}
            key={index}
          >
            <BodyText
              style={{
                fontWeight: "900",
                fontSize: 12,
                color: isLight ? primary : "#fff",
              }}
            >
              {item}
            </BodyText>
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  )
}
