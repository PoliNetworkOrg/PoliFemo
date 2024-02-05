import { MainStackScreen } from "navigation/NavigationTypes"
import { BodyText } from "components/Text"
import { PageWrap } from "components/PageLayout"
import { ScrollView } from "react-native"
import { usePalette } from "utils/colors"
import { ExamStatusType, getExamStatus } from "utils/exams"
import { Exam } from "api/collections/exams"
import { useEffect, useState } from "react"
import { ExamDetailsUpperDescriptor } from "components/Exams/ExamDetailsUpperDescriptor"
import { ExamBox } from "components/Exams/TeachingDetails/ExamBox"

export const TeachingDetails: MainStackScreen<"TeachingDetails"> = props => {
  /* const { t } = useTranslation("exams") */

  const teaching = props.route.params.teaching

  /* const lan = useCurrentLanguage() */

  const { palette } = usePalette()

  /* const { navigate } = useNavigation() */

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
              return (
                <ExamBox
                  key={exam.c_domanda}
                  exam={exam}
                  type={ExamStatusType.IN_ATTESA_DI_ESITO}
                />
              )
            })}
          </>
        )}
        {examsEnrolled && examsEnrolled.length > 0 && (
          <>
            <BodyText
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: palette.primary,
                marginTop: 32,
              }}
            >
              Iscrizioni effettuate
            </BodyText>
            {examsEnrolled?.map(exam => {
              return (
                <ExamBox
                  key={exam.c_domanda}
                  exam={exam}
                  type={ExamStatusType.ISCRITTO}
                />
              )
            })}
          </>
        )}
        {examsNotEnrolled && examsNotEnrolled.length > 0 && (
          <>
            <BodyText
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: palette.primary,
                marginTop: 32,
              }}
            >
              Puoi iscriverti a
            </BodyText>
            {examsNotEnrolled?.map(exam => {
              return (
                <ExamBox
                  key={exam.c_domanda}
                  exam={exam}
                  type={ExamStatusType.ISCRIZIONI_APERTE}
                />
              )
            })}
          </>
        )}
        {examsWithGrade && examsWithGrade.length > 0 && (
          <>
            <BodyText
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: palette.primary,
                marginTop: 32,
              }}
            >
              Esiti disponibili
            </BodyText>
            {examsWithGrade?.map(exam => {
              return (
                <ExamBox
                  key={exam.c_domanda}
                  exam={exam}
                  type={ExamStatusType.ESITO_DISPONIBILE}
                />
              )
            })}
          </>
        )}
      </ScrollView>
    </PageWrap>
  )
}
