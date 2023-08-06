import {
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
  runTiming,
  useComputedValue,
  useValue,
} from "@shopify/react-native-skia"
import { AdaptiveShadowView } from "components/BoxShadow"
import { Text } from "components/Text"
import { FC, useEffect, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { Easing, Extrapolate, interpolate } from "react-native-reanimated"
import { palette, usePalette } from "utils/colors"

export interface CareerStatsCircleProps {
  mean: number
  innerProgress: number
  outerProgress: number
}

export const CareerStatsCircle: FC<CareerStatsCircleProps> = ({
  mean,
  innerProgress,
  outerProgress,
}) => {
  const { isLight, background } = usePalette()

  const anim = useValue(0)
  useEffect(() => {
    runTiming(anim, 1, {
      duration: 1000,
      easing: Easing.bezierFn(0.31, 0.63, 0.46, 0.98),
    })
  }, [anim])

  const outerPath = useComputedValue(() => {
    const prog = interpolate(anim.current, [0, 1], [0, outerProgress])
    const angle = interpolate(prog, [0, 1], [0.1, 359.9], Extrapolate.CLAMP)
    const path = Skia.Path.Make()
    path.arcToOval(
      {
        height: 297 - 30,
        width: 297 - 30,
        x: 15,
        y: 15,
      },
      270,
      angle,
      true
    )
    return path
  }, [anim, outerProgress])

  const innerPath = useComputedValue(() => {
    const prog = interpolate(anim.current, [0, 1], [0, innerProgress])
    const angle = interpolate(prog, [0, 1], [0.1, 359.9], Extrapolate.CLAMP)
    const path = Skia.Path.Make()
    path.arcToOval(
      {
        height: 219 - 22,
        width: 219 - 22,
        y: (297 - 219 + 22) / 2,
        x: (297 - 219 + 22) / 2,
      },
      270,
      angle,
      true
    )
    return path
  }, [anim, innerProgress])

  const style = useMemo(
    () =>
      StyleSheet.create({
        meanCircle: {
          width: 149,
          height: 149,
          borderRadius: 149 / 2,
          backgroundColor: background,
          justifyContent: "center",
          alignItems: "center",
        },
        meanTitle: {
          fontSize: 14,
          fontWeight: "300",
          textAlign: "center",
          color: isLight ? palette.primary : "#ffffff",
        },
        meanText: {
          fontSize: 32,
          fontWeight: "bold",
          textAlign: "center",
          color: isLight ? palette.primary : "#ffffff",
        },
      }),
    [isLight]
  )

  return (
    <View
      style={{
        height: 297,
        marginTop: 30,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Canvas style={{ width: 297, height: 297, position: "absolute" }}>
        <Group style={"stroke"} strokeWidth={30} strokeCap="round">
          <Circle
            cx={297 / 2}
            cy={297 / 2}
            r={(297 - 30) / 2}
            opacity={0.3}
            color={palette.accent}
          />
          <Path path={outerPath} color={palette.accent} />
        </Group>
        <Group style={"stroke"} strokeWidth={22} strokeCap="round">
          <Circle
            cx={297 / 2}
            cy={297 / 2}
            r={(219 - 22) / 2}
            opacity={0.3}
            color={palette.primary}
          />
          <Path path={innerPath} color={palette.primary} />
        </Group>
      </Canvas>
      <AdaptiveShadowView
        shadow={{
          blur: 4,
          spread: 2,
          color: isLight ? palette.primary : "#000",
          opacity: 0.25,
          offset: { y: 4 },
        }}
        contentContainerStyle={style.meanCircle}
      >
        <Text style={style.meanTitle}>Media</Text>
        <Text style={style.meanText}>{mean}</Text>
      </AdaptiveShadowView>
    </View>
  )
}
