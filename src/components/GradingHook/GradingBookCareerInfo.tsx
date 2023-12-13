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
          width: 300,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "stretch",
          alignSelf: "center",
          padding: 4,
        },
        circle: {
          width: 20,
          height: 20,
          borderRadius: 10,
        },
        text: {
          fontSize: 14,
          fontWeight: "500",
          verticalAlign: "middle",
          lineHeight: 20,
          color: isLight ? palette.primary : "#ffffff",
        },
        legendTextContainer: {
          flexDirection: "row",
          gap: 12,
          marginVertical: 8,
        },
        numberContainer: {
          borderLeftWidth: 1.5,
          borderLeftColor: isLight ? palette.primary : "#fff",
          paddingLeft: 28,
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginVertical: 8,
        },
      }),
    [isLight]
  )

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.legendTextContainer}>
          <View style={[styles.circle, { backgroundColor: palette.accent }]} />
          <BodyText style={styles.text}>
            {t("gradingBook_obtained_cfu")}
          </BodyText>
        </View>
        <View style={styles.legendTextContainer}>
          <View style={[styles.circle, { backgroundColor: palette.color2 }]} />
          <BodyText style={styles.text}>
            {t("gradingBook_frequented_cfu")}
          </BodyText>
        </View>
        <View style={styles.legendTextContainer}>
          <View style={[styles.circle, { backgroundColor: palette.primary }]} />
          <BodyText style={styles.text}>{t("gradingBook_exams")}</BodyText>
        </View>
      </View>
      <View style={styles.numberContainer}>
        <BodyText
          style={styles.text}
        >{`${cfusObtained} / ${cfusPlanned}`}</BodyText>
        <BodyText style={styles.text}>{`${cfusPlanned} / ${maxCfu}`}</BodyText>
        <BodyText
          style={styles.text}
        >{`${examsGiven} / ${examsPlanned}`}</BodyText>
      </View>
    </View>
  )
}
