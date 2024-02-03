import { ExamDetailsUpperDescriptor } from "components/Exams/ExamDetailsUpperDescriptor"
import { PageWrap } from "components/PageLayout"
import { BodyText } from "components/Text"
import { MainStackScreen } from "navigation/NavigationTypes"
import { ScrollView } from "react-native-gesture-handler"
import { palette } from "utils/colors"

export const ResultDetails: MainStackScreen<"ResultDetails"> = props => {
  const teaching = props.route.params.teaching

  return (
    <PageWrap title={"Esito"}>
      <ScrollView contentContainerStyle={{ marginHorizontal: 32 }}>
        <BodyText
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: palette.variant3,
            marginBottom: 10,
          }}
        >
          {teaching.xdescrizione}
        </BodyText>
        <ExamDetailsUpperDescriptor teaching={teaching} />
      </ScrollView>
    </PageWrap>
  )
}
