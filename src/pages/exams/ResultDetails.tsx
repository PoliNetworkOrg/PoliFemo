import { Divider } from "components/Divider"
import { ExamDetailsUpperDescriptor } from "components/Exams/ExamDetailsUpperDescriptor"
import { PageWrap } from "components/PageLayout"
import { BodyText } from "components/Text"
import { MainStackScreen } from "navigation/NavigationTypes"
import { View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { usePalette } from "utils/colors"
//import polifemoIcon from "assets/polifemo/empty.svg"

//import { PolifemoMessage } from "components/FeedbackPolifemo/PolifemoMessage"

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
        <ExamDetailsUpperDescriptor
          teachingCode={teaching.c_classe_m}
          teacher={teaching.docente_esame}
          academicYear={teaching.ac_freq}
          currentYear={teaching.aa_classe}
          semester={teaching.semestre_freq}
        />
        {/*<PolifemoMessage
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
        />*/}
        <View style={{ marginTop: 40 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BodyText style={{ fontSize: 24, fontWeight: "900" }}>
              Status
            </BodyText>
            <BodyText style={{ fontSize: 20, fontWeight: "300" }}>
              pubblicato
            </BodyText>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <BodyText style={{ fontSize: 24, fontWeight: "900" }}>
              Esito
            </BodyText>
            <BodyText style={{ fontSize: 20, fontWeight: "700" }}>24</BodyText>
          </View>
          <View
            style={{
              marginTop: 20,
              backgroundColor: palette.accent,
              marginLeft: 50,
              marginRight: 50,
              padding: 5,
              borderRadius: 16,
            }}
          >
            <BodyText
              style={{ textAlign: "center", fontSize: 14, fontWeight: "900" }}
            >
              RIFIUTATO IL 24 GEN 2024
            </BodyText>
          </View>
          <Divider style={{ marginTop: 20 }} />
        </View>
      </ScrollView>
    </PageWrap>
  )
}
