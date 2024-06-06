import { Canvas, Circle, Group, Path, Skia } from "@shopify/react-native-skia"
import { Text } from "components/Text"
import { FC, useEffect, useMemo, useState } from "react"
import {
  Easing,
  Extrapolation,
  SharedValue,
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"
import { GradingBookCareerInfoProps } from "./GradingBookCareerInfo"
import { AdaptiveShadowView } from "components/BoxShadow"
import { palette, usePalette } from "utils/colors"

const maxCfu = 180

const CIRLCE_STROKE_1 = 22
const CIRLCE_STROKE_2 = 26
const CIRLCE_STROKE_3 = 30

const CIRCLE_WIDTH_1 = 198
const CIRCLE_WIDTH_2 = 260
const FULL_WIDTH = 330

const MEAN_CIRCLE_WIDTH = 130

export interface ProgressCircleCareerProps extends GradingBookCareerInfoProps {
  average: number
}

/**
 * Generates the Skia path for a circle given full diameter, stroke width,
 * and animation shared value, capping the interpolation to a stop value.
 */
function useDerivedPath(
  animation: SharedValue<number>,
  stop: number,
  width: number,
  stroke: number,
) {
  // useDerivedValue cannot itself call any synchronous functions, since its
  // argument is executed in a worklet. This is why everything is written plainly
  // here and this whole thing is wrapped in a custom hook.
  return useDerivedValue(() => {
    const progress = interpolate(animation.value, [0, 1], [0, stop])
    // the angle is the progress value mapped from 0 to 360, with a small give
    // to avoid weird artifacts
    const angle = interpolate(
      progress,
      [0, 1],
      [0.1, 359.99],
      Extrapolation.CLAMP,
    )
    const path = Skia.Path.Make()
    // this computes the circle arc path to the correct angle given the progress
    path.arcToOval(
      {
        height: width - stroke,
        width: width - stroke,
        x: (FULL_WIDTH - width + stroke) / 2,
        y: (FULL_WIDTH - width + stroke) / 2,
      },
      270,
      angle,
      true,
    )
    return path
  })
}

export const ProgressCircleCareer: FC<ProgressCircleCareerProps> = ({
  cfusGiven,
  cfusPlanned,
  examsGiven,
  examsPlanned,
  average,
}) => {
  const { t } = useTranslation("gradingBook")
  const [switchMark, setSwitchMark] = useState(true)
  const { isLight, background } = usePalette()

  // stats variable
  const cfuPercentage = cfusGiven / cfusPlanned
  const totalCfuPercentage = cfusPlanned / maxCfu
  const examsPercentage = examsGiven / examsPlanned
  const degreeGrade = `${((+average * 11) / 3).toFixed(2)}`

  // animation value used to fill the circle
  const anim = useSharedValue(0) // starts empty
  useEffect(() => {
    // This runs the smooth fill animation for the circle
    anim.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezierFn(0.31, 0.63, 0.46, 0.98), // this is smooth enough
    })
  }, [])

  // compose the circle paths, interpolating the animation value to the actual
  // progress
  const path1 = useDerivedPath(
    anim,
    examsPercentage,
    CIRCLE_WIDTH_1,
    CIRLCE_STROKE_1,
  )
  const path2 = useDerivedPath(
    anim,
    totalCfuPercentage,
    CIRCLE_WIDTH_2,
    CIRLCE_STROKE_2,
  )
  const path3 = useDerivedPath(anim, cfuPercentage, FULL_WIDTH, CIRLCE_STROKE_3)

  // components styles
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          height: FULL_WIDTH,
          marginTop: 12,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        meanCircle: {
          width: MEAN_CIRCLE_WIDTH,
          height: MEAN_CIRCLE_WIDTH,
          borderRadius: MEAN_CIRCLE_WIDTH / 2,
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
    [isLight],
  )

  return (
    <View style={[styles.container]}>
      <Canvas
        // this canvas is used to draw the circles
        style={{
          width: FULL_WIDTH,
          height: FULL_WIDTH,
          position: "absolute",
        }}
      >
        <Group style={"stroke"} strokeWidth={CIRLCE_STROKE_1} strokeCap="round">
          <Circle
            cx={FULL_WIDTH / 2}
            cy={FULL_WIDTH / 2}
            r={(CIRCLE_WIDTH_1 - CIRLCE_STROKE_1) / 2}
            opacity={0.2}
            color={palette.primary}
          />
          <Path path={path1} color={palette.primary} />
        </Group>
        <Group style={"stroke"} strokeWidth={CIRLCE_STROKE_2} strokeCap="round">
          <Circle
            cx={FULL_WIDTH / 2}
            cy={FULL_WIDTH / 2}
            r={(CIRCLE_WIDTH_2 - CIRLCE_STROKE_2) / 2}
            opacity={0.3}
            color={palette.color2}
          />
          <Path path={path2} color={palette.color2} />
        </Group>
        <Group style={"stroke"} strokeWidth={CIRLCE_STROKE_3} strokeCap="round">
          <Circle
            cx={FULL_WIDTH / 2}
            cy={FULL_WIDTH / 2}
            r={(FULL_WIDTH - CIRLCE_STROKE_3) / 2}
            opacity={0.3}
            color={palette.accent}
          />
          <Path path={path3} color={palette.accent} />
        </Group>
      </Canvas>

      <AdaptiveShadowView
        onPress={() => setSwitchMark(!switchMark)}
        shadow={{
          blur: 4,
          spread: 2,
          color: isLight ? palette.primary : "#000",
          opacity: 0.25,
          offset: { y: 4 },
        }}
        contentContainerStyle={styles.meanCircle}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "300",
            color: isLight ? palette.primary : "#fff",
          }}
        >
          {switchMark
            ? t("gradingBook_average")
            : t("gradingBook_degree_grade")}
        </Text>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "700",
            color: isLight ? palette.primary : "#fff",
          }}
        >
          {switchMark ? average : degreeGrade}
        </Text>
      </AdaptiveShadowView>
    </View>
  )
}
