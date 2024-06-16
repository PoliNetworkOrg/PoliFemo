import { ListPage } from "components/PageLayout"
import { MainStackScreen } from "navigation/NavigationTypes"
import { ExamResultsSection } from "components/Exams/Results/ExamResultsSection"

export const Results: MainStackScreen<"Results"> = props => {
  const { teachings } = props.route.params

  return (
    <ListPage
      title={"Esiti"}
      data={teachings.filter(t => t.appelliEsame.length > 0)}
      renderItem={({ item }) => (
        <ExamResultsSection
          resultExam={{
            teachingName: item.xdescrizione,
            teachingCode: item.c_classe_m,
            teacher: item.docente_esame,
            currentYear: item.aa_classe,
            academicYear: item.ac_freq,
            semester: item.semestre_freq,
            result: item.appelliEsame[0],
          }}
        />
      )}
    />
  )
}
