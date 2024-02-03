import { Teaching } from "api/collections/exams"
import { FC } from "react"
import { ExamSection } from "../ExamSection"
import {
  getExamStatus,
  getExamStatusDescription,
  monthsAcronymsIT,
} from "utils/exams"
import { View } from "react-native"
import { BodyText } from "components/Text"
import { palette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"

export interface ExamResultsSectionProps {
  teaching: Teaching
}

export const ExamResultsSection: FC<ExamResultsSectionProps> = props => {
  const { navigate } = useNavigation()

  const exams = props.teaching.appelliEsame

  const teachingName = props.teaching.xdescrizione

  return (
    <ExamSection
      title={teachingName}
      onPress={() => navigate("ResultDetails", { teaching: props.teaching })}
    >
      <View>
        {exams.map(exam => {
          const dateExam = new Date(exam.d_app)
          const day = dateExam.getDate()
          const month = monthsAcronymsIT[dateExam.getMonth()]
          const year = dateExam.getFullYear()
          const status = getExamStatus(exam)

          let dateRefuse, dayRefuse, monthRefuse, yearRefuse

          if (exam.iscrizioneAttiva?.verb_esito === "RF") {
            dateRefuse = exam.iscrizioneAttiva.verb_data_rifiuto
              ? new Date(exam.iscrizioneAttiva.verb_data_rifiuto)
              : undefined

            if (dateRefuse) {
              dayRefuse = dateRefuse.getDate()
              monthRefuse = monthsAcronymsIT[dateRefuse.getMonth()]
              yearRefuse = dateRefuse.getFullYear()
            }
          }

          return (
            <View
              key={exam.c_appello}
              style={{
                flex: 1,
                flexDirection: exam.inAttesaDiEsito ? "row" : "column",
                justifyContent: exam.inAttesaDiEsito
                  ? "space-between"
                  : undefined,
                marginBottom: 16,
                gap: 20,
              }}
            >
              <View>
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
                  {month} {year}
                  {" - ESAME"}
                </BodyText>
              </View>

              {exam.inAttesaDiEsito ? (
                <BodyText
                  style={{
                    marginRight: 16,
                    color: status.isHighlighted ? palette.accent : "#fff",
                    fontSize: 12,
                    fontWeight: "900",
                  }}
                >
                  {getExamStatusDescription(status.type, "it").toUpperCase()}
                </BodyText>
              ) : (
                <>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginRight: 16,
                    }}
                  >
                    <View
                      style={{
                        marginLeft: 16,
                        flex: 1,
                        flexDirection: "row",
                      }}
                    >
                      <BodyText
                        style={{
                          fontWeight: "900",
                          color: "#fff",
                          fontSize: 14,
                        }}
                      >
                        {"ESITO"}
                        {"  "}
                      </BodyText>

                      <View
                        style={{
                          backgroundColor: palette.accent,
                          borderRadius: 50,
                          padding: 5,
                          marginTop: -5,
                        }}
                      >
                        <BodyText
                          style={{
                            color: "#000",
                            fontSize: 14,
                            fontWeight: "500",
                          }}
                        >
                          {exam.iscrizioneAttiva?.verb_esito === "RF"
                            ? exam.iscrizioneAttiva?.verb_esito_rifiuto
                            : exam.iscrizioneAttiva?.xverbEsito}
                        </BodyText>
                      </View>
                    </View>

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
                        {"STATUS: "}
                      </BodyText>{" "}
                      {exam.iscrizioneAttiva?.xverbStatoDesc}
                    </BodyText>
                  </View>
                  {exam.iscrizioneAttiva?.verb_esito === "RF" ? (
                    <View>
                      <BodyText
                        style={{
                          marginLeft: 16,
                          color: palette.accent,
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                      >
                        {"RIFIUTATO IL " +
                          dayRefuse +
                          " " +
                          monthRefuse +
                          " " +
                          yearRefuse}
                      </BodyText>
                    </View>
                  ) : undefined}
                </>
              )}
            </View>
          )
        })}
      </View>
    </ExamSection>
  )
}
