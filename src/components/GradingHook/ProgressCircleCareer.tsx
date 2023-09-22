import { Text } from "components/Text"
import { FC, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"
import { CircularProgressBase } from "react-native-circular-progress-indicator"
import { GradingBookCareerInfoProps } from "./GradingBookCareerInfo"

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
            <Text onPress={() => setSwitchMark(!switchMark)}>
              <View style={styles.container}>
                <Text
                  style={{
                    fontSize: 15,
                  }}
                >
                  {switchMark
                    ? t("gradingBook_average")
                    : t("gradingBook_degree_grade")}
                </Text>
                <Text style={{ fontSize: 30 }}>
                  {switchMark ? average : degreeGrade}
                </Text>
              </View>
            </Text>
          </CircularProgressBase>
        </CircularProgressBase>
      </CircularProgressBase>
    </View>
  )
}
