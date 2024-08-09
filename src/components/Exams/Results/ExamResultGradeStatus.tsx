import { ActiveSubscription } from "api/collections/exams"
import { BodyText } from "components/Text"
import { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { monthsAcronymsIT } from "utils/exams"

export interface ExamResultGradeStatusProps {
  iscrizioneAttiva: ActiveSubscription | undefined
}

export const ExamResultGradeStatus: FC<ExamResultGradeStatusProps> = props => {
  const { iscrizioneAttiva } = props

  const { palette } = usePalette()

  let dateRefuse, dayRefuse, monthRefuse, yearRefuse

  if (iscrizioneAttiva?.verb_esito === "RF") {
    dateRefuse = iscrizioneAttiva.verb_data_rifiuto
      ? new Date(iscrizioneAttiva.verb_data_rifiuto)
      : undefined

    if (dateRefuse) {
      dayRefuse = dateRefuse.getDate()
      monthRefuse = monthsAcronymsIT[dateRefuse.getMonth()]
      yearRefuse = dateRefuse.getFullYear()
    }
  }
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginRight: 16,
        }}
      >
        <View
          style={{
            marginLeft: 16,
            flex: 1,
            flexDirection: "row",
          }}
        >
          <BodyText
            style={{
              fontWeight: "900",
              color: "#fff",
              fontSize: 14,
            }}
          >
            {"ESITO"}
            {"  "}
          </BodyText>

          <View
            style={{
              backgroundColor: palette.accent,
              borderRadius: 14,
              width: 28,
              height: 28,
              padding: 5,
              marginTop: -5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BodyText
              style={{
                color: palette.primary,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              {iscrizioneAttiva?.verb_esito === "RF"
                ? iscrizioneAttiva?.verb_esito_rifiuto
                : iscrizioneAttiva?.xverbEsito}
            </BodyText>
          </View>
        </View>

        <BodyText
          style={{
            marginLeft: 16,
            color: "#fff",
            fontSize: 14,
            fontWeight: "300",
          }}
        >
          <BodyText
            style={{
              fontWeight: "900",
              color: "#fff",
              fontSize: 14,
            }}
          >
            {"STATUS: "}
          </BodyText>{" "}
          {iscrizioneAttiva?.xverbStatoDesc}
        </BodyText>
      </View>
      {iscrizioneAttiva?.verb_esito === "RF" ? (
        <View>
          <BodyText
            style={{
              marginLeft: 16,
              color: palette.accent,
              fontSize: 12,
              fontWeight: "900",
            }}
          >
            {"RIFIUTATO IL " + dayRefuse + " " + monthRefuse + " " + yearRefuse}
          </BodyText>
        </View>
      ) : undefined}
    </>
  )
}
