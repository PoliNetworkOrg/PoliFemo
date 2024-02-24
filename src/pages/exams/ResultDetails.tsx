import { Divider } from "components/Divider"
import { ExamDetailsUpperDescriptor } from "components/Exams/ExamDetailsUpperDescriptor"
import { PolifemoMessage } from "components/FeedbackPolifemo/PolifemoMessage"
import { PageWrap } from "components/PageLayout"
import { BodyText } from "components/Text"
import { MainStackScreen } from "navigation/NavigationTypes"
import { View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { usePalette } from "utils/colors"
import polifemoIcon from "assets/polifemo/empty.svg"
import {
  getExamStatus,
  getExamStatusDescription,
  monthsAcronymsIT,
} from "utils/exams"
import { Icon } from "components/Icon"
import downloadIcon from "assets/exams/download.svg"

export const ResultDetails: MainStackScreen<"ResultDetails"> = props => {
  const {
    teacher,
    teachingCode,
    teachingName,
    currentYear,
    semester,
    academicYear,
    result,
  } = props.route.params.resultExam

  const { palette, isLight } = usePalette()

  const dateExam = new Date(result.d_app)
  const day = dateExam.getDate()
  const month = monthsAcronymsIT[dateExam.getMonth()]
  const year = dateExam.getFullYear()
  const status = getExamStatus(result)

  let dateRefuse, dayRefuse, monthRefuse, yearRefuse

  if (result.iscrizioneAttiva?.verb_esito === "RF") {
    dateRefuse = result.iscrizioneAttiva.verb_data_rifiuto
      ? new Date(result.iscrizioneAttiva.verb_data_rifiuto)
      : undefined

    if (dateRefuse) {
      dayRefuse = dateRefuse.getDate()
      monthRefuse = monthsAcronymsIT[dateRefuse.getMonth()]
      yearRefuse = dateRefuse.getFullYear()
    }
  }

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
          {teachingName}
        </BodyText>
        <BodyText
          style={{
            color: isLight ? palette.variant3 : "#FFFFFF",
            fontSize: 18,
            fontWeight: "300",
            marginBottom: 10,
          }}
        >
          <BodyText
            style={{
              fontWeight: "900",
              color: isLight ? palette.variant3 : "#FFFFFF",
              fontSize: 18,
            }}
          >
            {day}
          </BodyText>{" "}
          {month} {year}
          {" - ESAME"}
        </BodyText>
        <ExamDetailsUpperDescriptor
          teachingCode={teachingCode}
          teacher={teacher}
          academicYear={academicYear}
          currentYear={currentYear}
          semester={semester}
        />
        {result.inAttesaDiEsito ? (
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
        ) : (
          <View style={{ marginTop: 40 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BodyText
                style={{
                  fontSize: 24,
                  fontWeight: "900",
                  color: isLight ? palette.variant3 : "#FFFFFF",
                }}
              >
                Status
              </BodyText>
              <BodyText
                style={{
                  fontSize: 20,
                  fontWeight: "300",
                  color: isLight ? palette.variant3 : "#FFFFFF",
                }}
              >
                {getExamStatusDescription(status.type, "it").toUpperCase()}
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
              <BodyText
                style={{
                  fontSize: 24,
                  fontWeight: "900",
                  color: isLight ? palette.variant3 : "#FFFFFF",
                }}
              >
                Esito
              </BodyText>
              <BodyText
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: isLight ? palette.variant3 : "#FFFFFF",
                }}
              >
                {result.iscrizioneAttiva?.verb_esito === "RF"
                  ? result.iscrizioneAttiva?.verb_esito_rifiuto
                  : result.iscrizioneAttiva?.xverbEsito}
              </BodyText>
            </View>
            {result.iscrizioneAttiva?.verb_esito === "RF" ? (
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
                  style={{
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: "900",
                    color: isLight ? palette.variant3 : "#FFFFFF",
                  }}
                >
                  RIFIUTATO IL {dayRefuse} {monthRefuse} {yearRefuse}
                </BodyText>
              </View>
            ) : undefined}
            <Divider style={{ marginTop: 20, marginBottom: 20 }} />
            {result.iscrizioneAttiva?.hasCorrezioni ? (
              <View style={{ display: "flex", flexDirection: "column" }}>
                <BodyText
                  style={{
                    fontWeight: "900",
                    color: isLight ? palette.variant3 : "#FFFFFF",
                    fontSize: 18,
                  }}
                >
                  Correzioni
                </BodyText>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <BodyText
                    style={{
                      fontWeight: "300",
                      color: isLight ? palette.variant3 : "#FFFFFF",
                      fontSize: 16,
                    }}
                  >
                    1000000_MARIOROSSI.pdf
                  </BodyText>
                  <Icon
                    source={downloadIcon}
                    color={!isLight ? "white" : undefined}
                  />
                </View>
              </View>
            ) : undefined}
          </View>
        )}
      </ScrollView>
    </PageWrap>
  )
}
