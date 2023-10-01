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
import { Text } from "components/Text"
import { FC, useEffect, useMemo, useState } from "react"
import { Easing, Extrapolate, interpolate } from "react-native-reanimated"
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
 * and progress value.
 */
const generatePath = (width: number, stroke: number, progress: number) => {
  // the angle is the progress value mapped from 0 to 360, with a small give
  // to avoid weird artifacts
  const angle = interpolate(progress, [0, 1], [0.1, 359.99], Extrapolate.CLAMP)
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
    true
  )
  return path
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
  const anim = useValue(0) // starts empty
  useEffect(() => {
    // This runs the smooth fill animation for the circle
    runTiming(anim, 1, {
      duration: 1000,
      easing: Easing.bezierFn(0.31, 0.63, 0.46, 0.98), // this is smooth enough
    })
  }, [anim])

  // compose the circle paths, interpolating the animation value to the actual
  // progress
  const path1 = useComputedValue(() => {
    const progress = interpolate(anim.current, [0, 1], [0, examsPercentage])
    return generatePath(CIRCLE_WIDTH_1, CIRLCE_STROKE_1, progress)
  }, [anim, cfuPercentage])

  const path2 = useComputedValue(() => {
    const progress = interpolate(anim.current, [0, 1], [0, totalCfuPercentage])
    return generatePath(CIRCLE_WIDTH_2, CIRLCE_STROKE_2, progress)
  }, [anim, examsPercentage])

  const path3 = useComputedValue(() => {
    const progress = interpolate(anim.current, [0, 1], [0, cfuPercentage])
    return generatePath(FULL_WIDTH, CIRLCE_STROKE_3, progress)
  }, [anim, examsPercentage])

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
    [isLight]
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
