import { BodyText } from "components/Text"
import { FC, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, View } from "react-native"
import { palette, usePalette } from "utils/colors"

const maxCfu = 180

export interface GradingBookCareerInfoProps {
  cfusGiven: number
  cfusPlanned: number
  examsGiven: number
  examsPlanned: number
}

export const GradingBookCareerInfo: FC<GradingBookCareerInfoProps> = ({
  cfusGiven: cfusObtained,
  cfusPlanned,
  examsGiven,
  examsPlanned,
}) => {
  const { t } = useTranslation("gradingBook")
  const { isLight } = usePalette()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          alignSelf: "center",
        },
        circle: {
          width: 20,
          height: 20,
          borderRadius: 100 / 2,
          marginRight: 8,
          marginTop: 24,
        },
        text: {
          fontSize: 14,
          fontWeight: "500",
          color: isLight ? palette.primary : "#ffffff",
          marginTop: 20,
        },
        legendTextContainer: {
          flexDirection: "row",
        },
        separator: {
          marginTop: 20,
          marginLeft: 30,
          height: "90%",
          width: 2,
          backgroundColor: "#909090",
        },
      }),
    [isLight]
  )

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.legendTextContainer}>
          <View
            style={{ ...styles.circle, backgroundColor: palette.cfuCirle }}
          />
          <BodyText style={styles.text}>
            {t("gradingBook_obtained_cfu")}
          </BodyText>
        </View>
        <View style={styles.legendTextContainer}>
          <View style={{ ...styles.circle, backgroundColor: palette.accent }} />
          <BodyText style={styles.text}>
            {t("gradingBook_frequented_cfu")}
          </BodyText>
        </View>
        <View style={styles.legendTextContainer}>
          <View
            style={{ ...styles.circle, backgroundColor: palette.examsCirle }}
          />
          <BodyText style={styles.text}>{t("gradingBook_exams")}</BodyText>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={{ marginLeft: 30 }}>
        <BodyText style={styles.text}>{cfusObtained}</BodyText>
        <BodyText style={styles.text}>{cfusPlanned}</BodyText>
        <BodyText style={styles.text}>{examsGiven}</BodyText>
      </View>
      <View style={{ marginLeft: 5 }}>
        <BodyText style={styles.text}>{`/ ${cfusPlanned}`}</BodyText>
        <BodyText style={styles.text}>{`/ ${maxCfu}`}</BodyText>
        <BodyText style={styles.text}>{`/ ${examsPlanned}`}</BodyText>
      </View>
    </View>
  )
}
