import { PageWrap } from "components/PageLayout"
import { MainStackScreen } from "navigation/NavigationTypes"
import { ScrollView } from "react-native"
import { ExamResultsSection } from "components/Exams/Results/ExamResultsSection"

export const Results: MainStackScreen<"Results"> = props => {
  const { teachings } = props.route.params

  return (
    <PageWrap title={"Esiti"}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        bounces={false}
      >
        {teachings.map(teaching =>
          teaching.appelliEsame.map((result, j) => (
            <ExamResultsSection
              key={`${teaching.c_insegn_piano}_${j}`}
              resultExam={{
                teachingName: teaching.xdescrizione,
                teachingCode: teaching.c_classe_m,
                teacher: teaching.docente_esame,
                currentYear: teaching.aa_classe,
                academicYear: teaching.ac_freq,
                semester: teaching.semestre_freq,
                result: result,
              }}
            />
          )),
        )}
      </ScrollView>
    </PageWrap>
  )
}
