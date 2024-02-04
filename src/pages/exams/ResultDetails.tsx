import { ExamDetailsUpperDescriptor } from "components/Exams/ExamDetailsUpperDescriptor"
import { PageWrap } from "components/PageLayout"
import { BodyText } from "components/Text"
import { MainStackScreen } from "navigation/NavigationTypes"
import { ScrollView } from "react-native-gesture-handler"
import { usePalette } from "utils/colors"
import polifemoIcon from "assets/polifemo/empty.svg"

import { PolifemoMessage } from "components/FeedbackPolifemo/PolifemoMessage"

export const ResultDetails: MainStackScreen<"ResultDetails"> = props => {
  const teaching = props.route.params.teaching

  const { palette, isLight } = usePalette()

  return (
    <PageWrap title={"Esito"}>
      <ScrollView contentContainerStyle={{ marginHorizontal: 32 }}>
        <BodyText
          style={{
            fontSize: 21,
            fontWeight: "700",
            color: isLight ? palette.variant3 : "#FFFFFF",
            marginBottom: 10,
          }}
        >
          {teaching.xdescrizione}
        </BodyText>
        <BodyText
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "300",
            marginBottom: 10,
          }}
        >
          <BodyText
            style={{
              fontWeight: "900",
              color: "#fff",
              fontSize: 18,
            }}
          >
            {19}
          </BodyText>{" "}
          {"GEN"} {"2024"}
          {" - ESAME"}
        </BodyText>
        <ExamDetailsUpperDescriptor teaching={teaching} />
        <PolifemoMessage
          title="In attesa di esito"
          subTitle="Polifemo è dispiaciuto"
          icon={polifemoIcon}
          styleTitle={{
            color: isLight ? palette.variant3 : "#FFFFFF",
            fontWeight: "600",
          }}
          styleSubTitle={{
            color: isLight ? palette.variant3 : "#FFFFFF",
            fontSize: 14,
          }}
        />
      </ScrollView>
    </PageWrap>
  )
}
