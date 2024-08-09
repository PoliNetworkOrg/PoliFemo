import { FC } from "react"
import { BodyText } from "components/Text"
import { usePalette } from "utils/colors"
import { Exam } from "api/collections/exams"
import { ExamStatusType, monthsAcronymsEN, monthsAcronymsIT } from "utils/exams"
import { useCurrentLanguage } from "utils/language"
import { Pressable, View } from "react-native"
import { Icon } from "components/Icon"
import arrowRightSvg from "assets/exams/arrow_right.svg"
import { ExamInfoWhiteLine } from "../ExamInfoWhiteLine"
/* import { ExamResultGradeStatus } from "../Results/ExamResultGradeStatus"
 */
export interface ExamBoxProps {
  exam: Exam
  type: ExamStatusType
  onPress?: () => void
}

export const ExamBox: FC<ExamBoxProps> = props => {
  const { exam, type, onPress } = props

  const { palette } = usePalette()

  const lan = useCurrentLanguage()

  const dateExam = new Date(exam.d_app)

  const day = dateExam.getDate()

  const month =
    lan === "it"
      ? monthsAcronymsIT[dateExam.getMonth()]
      : monthsAcronymsEN[dateExam.getMonth()]

  const year = dateExam.getFullYear()

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor: palette.primary,
          borderRadius: 16,
          paddingVertical: 12,
          marginTop: 8,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
            {month} {year} - {exam.descTipoAppello}
          </BodyText>

          <Icon
            source={arrowRightSvg}
            scale={1.2}
            style={{ marginRight: 16 }}
          />
        </View>

        <ExamInfoWhiteLine exam={exam} type={type} />

        {/* {type === ExamStatusType.ESITO_DISPONIBILE && (
          <>
            <View style={{ height: 16 }} />
            <ExamResultGradeStatus iscrizioneAttiva={exam.iscrizioneAttiva} />
          </>
        )} */}
      </View>
    </Pressable>
  )
}
