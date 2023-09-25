import { Text } from "components/Text"
import { FC, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"
import { CircularProgressBase } from "react-native-circular-progress-indicator"
import { GradingBookCareerInfoProps } from "./GradingBookCareerInfo"
import { AdaptiveShadowView } from "components/BoxShadow"
import { palette, usePalette } from "utils/colors"

const maxCfu = 180

export interface ProgressCircleCareerProps extends GradingBookCareerInfoProps {
  average: number
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
  const cfuPercentual = useMemo(
    () => (cfusGiven * 100) / cfusPlanned,
    [cfusGiven, cfusPlanned]
  )
  const totalCfuPercentual = useMemo(
    () => (cfusPlanned * 100) / maxCfu,
    [cfusPlanned]
  )
  const examsPercentual = useMemo(
    () => (examsGiven * 100) / examsPlanned,
    [examsGiven, examsPlanned]
  )
  const degreeGrade = useMemo(
    () => `${((+average * 11) / 3).toFixed(2)}`,
    [average]
  )

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
    },
    meanCircle: {
      width: 120,
      height: 120,
      borderRadius: 120 / 2,
      backgroundColor: background,
      justifyContent: "center",
      alignItems: "center",
    },
  })

  return (
    <View style={{ ...styles.container, paddingTop: 20 }}>
      <CircularProgressBase
        activeStrokeWidth={30}
        inActiveStrokeWidth={30}
        inActiveStrokeOpacity={0.3}
        value={examsPercentual}
        radius={154}
        activeStrokeColor={"#1ad67b"}
        inActiveStrokeColor={"#1ad67b"}
      >
        <CircularProgressBase
          activeStrokeWidth={30}
          inActiveStrokeWidth={30}
          inActiveStrokeOpacity={0.4}
          value={totalCfuPercentual}
          radius={122}
          activeStrokeColor={"#f2ba52"}
          inActiveStrokeColor={"#f2ba52"}
        >
          <CircularProgressBase
            activeStrokeWidth={25}
            inActiveStrokeWidth={25}
            inActiveStrokeOpacity={0.2}
            value={cfuPercentual}
            radius={90}
            activeStrokeColor={"#8791bd"}
            inActiveStrokeColor={"#8791bd"}
          >
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
                  color: isLight ? palette.primary : "#fff",
                }}
              >
                {switchMark ? average : degreeGrade}
              </Text>
            </AdaptiveShadowView>
          </CircularProgressBase>
        </CircularProgressBase>
      </CircularProgressBase>
    </View>
  )
}
