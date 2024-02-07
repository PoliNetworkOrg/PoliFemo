import { FC } from "react"
import { BodyText } from "components/Text"
/* import { usePalette } from "utils/colors" */
import { Exam } from "api/collections/exams"
import { ExamStatusType, getDateExamString } from "utils/exams"
import { useCurrentLanguage } from "utils/language"
import { Pressable, View } from "react-native"

export interface ExamInfoWhiteLineProps {
  exam: Exam
  type: ExamStatusType
  onPress?: () => void
}

export const ExamInfoWhiteLine: FC<ExamInfoWhiteLineProps> = props => {
  const { exam, type, onPress } = props

  /* const { isLight, palette } = usePalette() */

  const lan = useCurrentLanguage()

  return type === ExamStatusType.IN_ATTESA_DI_ESITO ||
    type === ExamStatusType.ESITO_DISPONIBILE ? null : (
    <Pressable onPress={onPress} disabled={onPress ? false : true}>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          marginHorizontal: 18,
          marginTop: 4,
        }}
      >
        <View
          style={{
            width: 1.5,
            backgroundColor: "#fff",
            marginRight: 8,
          }}
        />
        <View
          style={{
            flexDirection: "column",
            paddingVertical: 2,
          }}
        >
          {type === ExamStatusType.ISCRIZIONI_APERTE && (
            <BodyText
              style={{
                color: "#fff",
                fontSize: 11,
                fontWeight: "900",
              }}
            >
              {"ISCRIZIONI: "}
              <BodyText
                style={{
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: "300",
                }}
              >
                {getDateExamString(exam.d_apertura, lan)}
                {" - "}
                {getDateExamString(exam.d_chiusura, lan)}
              </BodyText>
            </BodyText>
          )}
          <BodyText
            style={{
              color: "#fff",
              fontSize: 11,
              fontWeight: "900",
            }}
          >
            {`${type === ExamStatusType.ISCRITTO ? "ORA" : "ORA ESAME"} :`}{" "}
            <BodyText
              style={{
                color: "#fff",
                fontSize: 11,
                fontWeight: "300",
              }}
            >
              {exam.xh_appello}
            </BodyText>
          </BodyText>
          <BodyText
            style={{
              color: "#fff",
              fontSize: 11,
              fontWeight: "900",
            }}
          >
            {`${type === ExamStatusType.ISCRITTO ? "AULA" : "AULA ESAME"} :`}{" "}
            <BodyText
              style={{
                color: "#fff",
                fontSize: 11,
                fontWeight: "300",
              }}
            >
              {exam.xaula}
            </BodyText>
          </BodyText>
          {type === ExamStatusType.ISCRITTO && (
            <BodyText
              style={{
                color: "#fff",
                fontSize: 11,
                fontWeight: "300",
              }}
            >
              {exam.numIscrittiAppello} persone iscritte
            </BodyText>
          )}
        </View>
      </View>
    </Pressable>
  )
}
