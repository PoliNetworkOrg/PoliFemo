import { ReducedTeachingExam } from "api/collections/exams"
import { FC } from "react"
import { ExamSection } from "../ExamSection"
import {
  getExamStatus,
  getExamStatusDescription,
  monthsAcronymsIT,
} from "utils/exams"
import { View } from "react-native"
import { BodyText } from "components/Text"
import { palette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"
import { ExamResultGradeStatus } from "./ExamResultGradeStatus"

export interface ExamResultsSectionProps {
  resultExam: ReducedTeachingExam
}

export const ExamResultsSection: FC<ExamResultsSectionProps> = props => {
  const { navigate } = useNavigation()

  const { teachingName, result } = props.resultExam

  const dateExam = new Date(result.d_app)
  const day = dateExam.getDate()
  const month = monthsAcronymsIT[dateExam.getMonth()]
  const year = dateExam.getFullYear()
  const status = getExamStatus(result)

  return (
    <ExamSection
      title={teachingName}
      onPress={() =>
        navigate("ResultDetails", { resultExam: props.resultExam })
      }
    >
      <View>
        <View
          key={result.c_appello}
          style={{
            flex: 1,
            flexDirection: result.inAttesaDiEsito ? "row" : "column",
            justifyContent: result.inAttesaDiEsito
              ? "space-between"
              : undefined,
            marginBottom: 16,
            gap: 20,
          }}
        >
          <View>
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
                {day}
              </BodyText>{" "}
              {month} {year}
              {" - ESAME"}
            </BodyText>
          </View>

          {result.inAttesaDiEsito ? (
            <BodyText
              style={{
                marginRight: 16,
                color: status.isHighlighted ? palette.accent : "#fff",
                fontSize: 12,
                fontWeight: "900",
              }}
            >
              {getExamStatusDescription(status.type, "it").toUpperCase()}
            </BodyText>
          ) : (
            <ExamResultGradeStatus iscrizioneAttiva={result.iscrizioneAttiva} />
          )}
        </View>
      </View>
    </ExamSection>
  )
}
