import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"

import { BodyText } from "components/Text"

import { PageWrap } from "components/PageLayout"

import { useCurrentLanguage } from "utils/language"
import { ScrollView, View } from "react-native"
import { usePalette } from "utils/colors"
import {
  ExamStatusType,
  getExamStatus,
  monthsAcronymsEN,
  monthsAcronymsIT,
} from "utils/exams"
import { Exam } from "api/collections/exams"
import { useEffect, useState } from "react"
import { Icon } from "components/Icon"
import arrowRightSvg from "assets/exams/arrow_right.svg"
import { ExamDetailsUpperDescriptor } from "components/Exams/ExamDetailsUpperDescriptor"

export const TeachingDetails: MainStackScreen<"TeachingDetails"> = props => {
  /* const { t } = useTranslation("exams") */

  const teaching = props.route.params.teaching

  const lan = useCurrentLanguage()

  const { palette } = usePalette()

  const { navigate } = useNavigation()

  const [examsPendingGrade, setExamsPendingGrade] = useState<
    Exam[] | undefined
  >(undefined)

  const [examsWithGrade, setExamsWithGrade] = useState<Exam[] | undefined>(
    undefined
  )

  const [examsEnrolled, setExamsEnrolled] = useState<Exam[] | undefined>(
    undefined
  )

  const [examsNotEnrolled, setExamsNotEnrolled] = useState<Exam[] | undefined>(
    undefined
  )

  useEffect(() => {
    const examsPendingGradeTemp: Exam[] = []
    const examsWithGradeTemp: Exam[] = []
    const examsEnrolledTemp: Exam[] = []
    const examsNotEnrolledTemp: Exam[] = []

    teaching.appelliEsame.forEach(exam => {
      const status = getExamStatus(exam).type

      switch (status) {
        case ExamStatusType.IN_ATTESA_DI_ESITO:
          examsPendingGradeTemp.push(exam)
          break
        case ExamStatusType.ESITO_DISPONIBILE:
          examsWithGradeTemp.push(exam)
          break
        case ExamStatusType.ISCRITTO:
          examsEnrolledTemp.push(exam)
          break
        case ExamStatusType.ISCRIZIONI_APERTE:
          examsNotEnrolledTemp.push(exam)
          break
      }
    })

    setExamsPendingGrade(examsPendingGradeTemp)
    setExamsWithGrade(examsWithGradeTemp)
    setExamsEnrolled(examsEnrolledTemp)
    setExamsNotEnrolled(examsNotEnrolledTemp)
  }, [])

  return (
    <PageWrap title={teaching.xdescrizione} fontSizeTitle={28}>
      <ScrollView contentContainerStyle={{ marginHorizontal: 32 }}>
        <ExamDetailsUpperDescriptor
          teachingCode={teaching.c_classe_m}
          teacher={teaching.docente_esame}
          academicYear={teaching.ac_freq}
          currentYear={teaching.aa_classe}
          semester={teaching.semestre_freq}
        />

        {examsPendingGrade && examsPendingGrade.length > 0 && (
          <>
            <BodyText
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: palette.primary,
                marginTop: 32,
              }}
            >
              In attesa di esito
            </BodyText>
            {examsPendingGrade?.map(exam => {
              const dateExam = new Date(exam.d_app)

              const day = dateExam.getDate()

              const month =
                lan === "it"
                  ? monthsAcronymsIT[dateExam.getMonth()]
                  : monthsAcronymsEN[dateExam.getMonth()]

              const year = dateExam.getFullYear()
              return (
                <View
                  key={exam.c_domanda}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 8,
                    backgroundColor: palette.primary,
                    borderRadius: 16,
                    paddingVertical: 12,
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
              )
            })}
          </>
        )}
      </ScrollView>
    </PageWrap>
  )
}
