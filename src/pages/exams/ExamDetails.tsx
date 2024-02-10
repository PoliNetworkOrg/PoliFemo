import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { BodyText, Title } from "components/Text"
import { PageWrap } from "components/PageLayout"
import { Pressable, ScrollView, View } from "react-native"
import { usePalette } from "utils/colors"
import { getDateExamString, toPascalCase } from "utils/exams"
import { ExamDetailsUpperDescriptor } from "components/Exams/ExamDetailsUpperDescriptor"
import { useCurrentLanguage } from "utils/language"
import { Icon } from "components/Icon"
import dangerousIcon from "assets/exams/dangerous_cancel.svg"
import { Modal } from "components/Modal"
import { useEffect, useState } from "react"
import { LoadingIndicator } from "components/LoadingIndicator"
import { wait } from "utils/functions"
import checkIcon from "assets/exams/check.svg"

enum Status {
  START,
  WAITING_RESPONSE,
  SUCCESS,
  ERROR,
}

export const ExamDetails: MainStackScreen<"ExamDetails"> = props => {
  /* const { t } = useTranslation("exams") */

  const teaching = props.route.params.teaching

  const exam = teaching.appelliEsame.find(
    exam => exam.c_appello == props.route.params.codeAppello
  )

  const lan = useCurrentLanguage()

  const { palette } = usePalette()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const [status, setStatus] = useState<Status>(Status.START)

  const navigation = useNavigation()

  useEffect(() => {
    if (status === Status.SUCCESS) {
      navigation.navigate("Exams", { updateTeachings: true })
    }
  }, [status])

  return (
    <PageWrap
      title={exam?.descTipoAppello}
      titleStyle={{ paddingBottom: 0 }}
      sideTitleElement={
        exam?.iscrizioneAttiva ? (
          <View
            style={{
              marginTop: 10,
              height: 26,
              backgroundColor: palette.accent,
              paddingHorizontal: 16,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BodyText
              style={{
                color: palette.primary,
                fontSize: 16,
                fontWeight: "900",
              }}
            >
              ISCRITTO
            </BodyText>
          </View>
        ) : null
      }
    >
      <ScrollView contentContainerStyle={{ marginHorizontal: 32 }}>
        <Title style={{ fontSize: 28, marginBottom: 12 }}>
          {toPascalCase(teaching.xdescrizione)}
        </Title>
        <ExamDetailsUpperDescriptor
          teachingCode={teaching.c_classe_m}
          teacher={teaching.docente_esame}
          academicYear={teaching.ac_freq}
          currentYear={teaching.aa_classe}
          semester={teaching.semestre_freq}
        />
        {exam && (
          <>
            <View
              style={{
                marginTop: 20,
                marginBottom: 16,
                flex: 1,
                height: 64,
                backgroundColor: palette.lighter,
                borderRadius: 16,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BodyText
                  style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}
                >
                  Data
                </BodyText>
                <BodyText
                  style={{
                    fontSize: 20,
                    fontWeight: "300",
                    color: "#fff",
                    lineHeight: 24,
                  }}
                >
                  {getDateExamString(exam?.d_app, lan)}
                </BodyText>
              </View>
              <View
                style={{
                  width: "40%",
                  backgroundColor: palette.primary,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BodyText
                  style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}
                >
                  Ore
                </BodyText>
                <BodyText
                  style={{
                    fontSize: 20,
                    fontWeight: "300",
                    color: "#fff",
                    lineHeight: 24,
                  }}
                >
                  {exam.xh_appello}
                </BodyText>
              </View>
            </View>
            <View style={{ marginBottom: 16 }}>
              <BodyText
                style={{
                  fontSize: 20,
                  color: palette.primary,
                  fontWeight: "900",
                }}
              >
                Iscrizioni
              </BodyText>
              <BodyText
                style={{
                  fontSize: 16,
                  color: palette.primary,
                  fontWeight: "300",
                }}
              >
                Dal {getDateExamString(exam.d_apertura, lan)} Al{" "}
                {getDateExamString(exam.d_chiusura, lan)}
              </BodyText>
            </View>
            <View style={{ marginBottom: 16 }}>
              <BodyText
                style={{
                  fontSize: 20,
                  color: palette.primary,
                  fontWeight: "900",
                }}
              >
                Aula
              </BodyText>
              <BodyText
                style={{
                  fontSize: 16,
                  color: palette.primary,
                  fontWeight: "300",
                }}
              >
                {exam.xaula}
              </BodyText>
            </View>
            <BodyText
              style={{
                fontSize: 16,
                color: palette.primary,
                fontWeight: "300",
              }}
            >
              {exam.numIscrittiAppello} persone iscritte
            </BodyText>
            <Pressable
              onPress={() => {
                setIsModalVisible(true)
              }}
            >
              <View
                style={{
                  marginTop: 24,
                  backgroundColor: palette.primary,
                  height: 64,
                  borderRadius: 16,
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 24,
                }}
              >
                <BodyText
                  style={{ fontSize: 18, color: "#fff", fontWeight: "700" }}
                >
                  {exam.iscrizioneAttiva ? "CANCELLA ISCRIZIONE" : "ISCRIVITI"}
                </BodyText>
                {exam.iscrizioneAttiva ? (
                  <>
                    <View
                      style={{
                        height: 24,
                        width: 24,
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                      }}
                    >
                      <Icon
                        source={dangerousIcon}
                        scale={0.7}
                        style={{ position: "absolute" }}
                      />
                    </View>
                  </>
                ) : null}
              </View>
            </Pressable>
          </>
        )}
      </ScrollView>
      <Modal
        isShowing={isModalVisible}
        onClose={() => {
          // dont allow to close the modal if the status is not waiting response or success
          if (status != Status.WAITING_RESPONSE && status != Status.SUCCESS) {
            setIsModalVisible(false)
            void wait(200).then(() => setStatus(Status.START))
          }
        }}
        title={
          exam?.iscrizioneAttiva
            ? "Sicuro/a di voler cancellare l'iscrizione all'esame?"
            : "Iscriviti all'esame"
        }
        subTitleStyle={{
          fontWeight: "900",
          marginTop: 58,
          marginVertical: 0,
        }}
        centerText={true}
        buttons={[
          {
            text: "Annulla",
            light: true,
            style: {
              alignSelf: "center",
              minWidth: 120,
              marginTop: 16,
              marginBottom: 10,
              marginLeft: 16,
            },
            onPress: () => {
              setIsModalVisible(false)
              void wait(200).then(() => setStatus(Status.START))
            },
          },
          {
            text: "Conferma",
            light: false,
            style: {
              alignSelf: "center",
              minWidth: 120,
              marginTop: 16,
              marginRight: 16,
              marginBottom: 10,
            },
            onPress: () => {
              if (exam?.iscrizioneAttiva) {
                console.log("cancella")
                setStatus(Status.WAITING_RESPONSE)
                void wait(1000).then(() => {
                  setStatus(Status.ERROR)
                })
              } else {
                console.log("iscrivi")
                setStatus(Status.WAITING_RESPONSE)
                void wait(1000).then(() => {
                  setStatus(Status.SUCCESS)
                  setIsModalVisible(false)
                })
              }
            },
          },
        ]}
      >
        {status === Status.WAITING_RESPONSE ? (
          <View style={{ justifyContent: "center", marginVertical: 16 }}>
            <LoadingIndicator />
          </View>
        ) : status === Status.SUCCESS ? (
          <Icon
            source={checkIcon}
            style={{ alignSelf: "center", marginTop: 20 }}
          />
        ) : status === Status.ERROR ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 24,
            }}
          >
            <BodyText
              style={{
                fontSize: 20,
                color: palette.primary,
                fontWeight: "700",
              }}
            >
              Errore
            </BodyText>
          </View>
        ) : (
          <Icon
            source={dangerousIcon}
            style={{ alignSelf: "center", marginTop: 20 }}
          />
        )}
      </Modal>
    </PageWrap>
  )
}