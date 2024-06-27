import { MainStackScreen } from "navigation/NavigationTypes"
import { BodyText } from "components/Text"
import { PageWrap } from "components/PageLayout"
import { ScrollView, View } from "react-native"
import { usePalette } from "utils/colors"
import { ExamStatusType, getExamStatus } from "utils/exams"
import { Exam } from "api/collections/exams"
import { useEffect, useState } from "react"
import { ExamDetailsUpperDescriptor } from "components/Exams/ExamDetailsUpperDescriptor"
import { ExamBox } from "components/Exams/TeachingDetails/ExamBox"
import { useNavigation } from "navigation/NavigationTypes"

export const TeachingDetails: MainStackScreen<"TeachingDetails"> = props => {
  /* const { t } = useTranslation("exams") */

  const teaching = props.route.params.teaching

  /* const lan = useCurrentLanguage() */

  const { navigate } = useNavigation()

  const [examsPendingGrade, setExamsPendingGrade] = useState<
    Exam[] | undefined
  >(undefined)

  const [examsWithGrade, setExamsWithGrade] = useState<Exam[] | undefined>(
    undefined,
  )

  const [examsEnrolled, setExamsEnrolled] = useState<Exam[] | undefined>(
    undefined,
  )

  const [examsNotEnrolled, setExamsNotEnrolled] = useState<Exam[] | undefined>(
    undefined,
  )

  const { isLight, palette } = usePalette()

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
        <View style={{ height: 16 }} />
        {examsPendingGrade && examsPendingGrade.length > 0 && (
          <>
            <BodyText
              style={{
                fontSize: 20,
                fontWeight: "900",
                color: isLight ? palette.primary : "#fff",
                marginTop: 16,
              }}
            >
              In attesa di esito
            </BodyText>
            {examsPendingGrade?.map(exam => {
              return (
                <ExamBox
                  key={exam.c_appello}
                  exam={exam}
                  type={ExamStatusType.IN_ATTESA_DI_ESITO}
                  onPress={() => {
                    navigate("ResultDetails", {
                      resultExam: {
                        teachingName: teaching.xdescrizione,
                        teachingCode: teaching.c_classe_m,
                        teacher: teaching.docente_esame,
                        currentYear: teaching.aa_classe,
                        academicYear: teaching.ac_freq,
                        semester: teaching.semestre_freq,
                        result: teaching.appelliEsame[0],
                      },
                    })
                  }}
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
                color: isLight ? palette.primary : "#fff",
                marginTop: 16,
              }}
            >
              Iscrizioni effettuate
            </BodyText>
            {examsEnrolled?.map(exam => {
              return (
                <ExamBox
                  key={exam.c_appello}
                  exam={exam}
                  type={ExamStatusType.ISCRITTO}
                  onPress={() => {
                    navigate("ExamDetails", {
                      teaching: teaching,
                      codeAppello: exam.c_appello,
                    })
                  }}
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
                color: isLight ? palette.primary : "#fff",
                marginTop: 16,
              }}
            >
              Puoi iscriverti a
            </BodyText>
            {examsNotEnrolled?.map(exam => {
              return (
                <ExamBox
                  key={exam.c_appello}
                  exam={exam}
                  type={ExamStatusType.ISCRIZIONI_APERTE}
                  onPress={() => {
                    navigate("ExamDetails", {
                      teaching: teaching,
                      codeAppello: exam.c_appello,
                    })
                  }}
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
                color: isLight ? palette.primary : "#fff",
                marginTop: 16,
              }}
            >
              Esiti disponibili
            </BodyText>
            {examsWithGrade?.map(exam => {
              return (
                <ExamBox
                  key={exam.c_appello}
                  exam={exam}
                  type={ExamStatusType.ESITO_DISPONIBILE}
                  onPress={() => {
                    navigate("ResultDetails", {
                      resultExam: {
                        teachingName: teaching.xdescrizione,
                        teachingCode: teaching.c_classe_m,
                        teacher: teaching.docente_esame,
                        currentYear: teaching.aa_classe,
                        academicYear: teaching.ac_freq,
                        semester: teaching.semestre_freq,
                        result: teaching.appelliEsame[0],
                      },
                    })
                  }}
                />
              )
            })}
          </>
        )}
      </ScrollView>
    </PageWrap>
  )
}
