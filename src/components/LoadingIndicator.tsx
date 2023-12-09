import {
  Canvas,
  Circle,
  Group,
  Mask,
  SweepGradient,
  Transforms2d,
  useClockValue,
  useComputedValue,
  vec,
} from "@shopify/react-native-skia"
import { FC } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { usePalette } from "utils/colors"

interface LoadingIndicatorProps {
  style?: StyleProp<ViewStyle>
}

/**
 * Loading indicator, a circle that spins around.
 */
export const LoadingIndicator: FC<LoadingIndicatorProps> = props => {
  const { palette } = usePalette()

  const clock = useClockValue()
  const spinValue = useComputedValue(() => {
    const interval = 1000
    return -(clock.current % interval) / interval
  }, [clock])

  const transform = useComputedValue<Transforms2d>(() => {
    return [
      {
        rotate: spinValue.current * Math.PI * 2,
      },
    ]
  }, [spinValue])

  return (
    <View
      style={[
        {
          flex: 1,
          marginVertical: 40,
          justifyContent: "center",
          alignItems: "center",
        },
        props.style,
      ]}
    >
      <Canvas style={{ width: 105, height: 105 }}>
        <Group transform={transform} origin={{ x: 52.5, y: 52.5 }}>
          <Mask
            mode="luminance"
            mask={
              <Group>
                <Circle cx={52.5} cy={52.5} r={52.5} color="white" />
                <Circle cx={52.5} cy={52.5} r={38.63} color="black" />
              </Group>
            }
          >
            <Circle cx={52.5} cy={52.5} r={52.5}>
              <SweepGradient
                c={vec(52.5, 52.5)}
                colors={[palette.accent, "#d9d9d900"]}
              />
            </Circle>
          </Mask>
          <Circle cx={98.065} cy={52.5} r={6.935} color={palette.accent} />
        </Group>
      </Canvas>
    </View>
  )
}
