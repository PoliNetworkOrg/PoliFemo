import { BodyText } from "components/Text"
import { FC, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { palette, usePalette } from "utils/colors"

export interface CareerStatsInfoProps {
  cfusGiven: number
  cfusPlanned: number
  examsGiven: number
  examsPlanned: number
}

export const CareerStatsInfo: FC<CareerStatsInfoProps> = ({
  cfusGiven: cfusObtained,
  cfusPlanned,
  examsGiven,
  examsPlanned,
}) => {
  const { isLight } = usePalette()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: { alignItems: "center" },
        container: {
          width: 297,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "stretch",
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
          color: isLight ? palette.primary : "#ffffff",
        },
        legendTextContainer: {
          flexDirection: "row",
          gap: 12,
          marginVertical: 8,
        },
        numberContainer: {
          borderLeftWidth: 1.5,
          borderLeftColor: isLight ? "#000" : "#fff",
          paddingLeft: 28,
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginVertical: 8,
        },
      }),
    [isLight]
  )

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View>
          <View style={styles.legendTextContainer}>
            <View
              style={[styles.circle, { backgroundColor: palette.accent }]}
            />
            <BodyText style={styles.text}>CFU Ottenuti</BodyText>
          </View>
          <View style={styles.legendTextContainer}>
            <View
              style={[
                styles.circle,
                { backgroundColor: palette.accent, opacity: 0.3 },
              ]}
            />
            <BodyText style={styles.text}>CFU pianificati</BodyText>
          </View>
          <View style={styles.legendTextContainer}>
            <View
              style={[styles.circle, { backgroundColor: palette.primary }]}
            />
            <BodyText style={styles.text}>Esami dati</BodyText>
          </View>
          <View style={styles.legendTextContainer}>
            <View
              style={[
                styles.circle,
                { backgroundColor: palette.primary, opacity: 0.3 },
              ]}
            />
            <BodyText style={styles.text}>Esami pianificati</BodyText>
          </View>
        </View>
        <View style={styles.numberContainer}>
          <BodyText style={styles.text}>{cfusObtained}</BodyText>
          <BodyText style={styles.text}>{cfusPlanned}</BodyText>
          <BodyText style={styles.text}>{examsGiven}</BodyText>
          <BodyText style={styles.text}>{examsPlanned}</BodyText>
        </View>
      </View>
    </View>
  )
}
