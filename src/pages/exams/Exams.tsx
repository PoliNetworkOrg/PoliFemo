import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"

import { BodyText } from "components/Text"

import { PageWrap } from "components/PageLayout"
import WebView from "react-native-webview"
import { useContext, useEffect, useRef, useState } from "react"
import { HttpClient } from "api/HttpClient"
import { LoginContext } from "contexts/login"
import { api } from "api"
import { Teaching, fakeTeachings } from "api/collections/exams"
import { AdaptiveShadowView } from "components/BoxShadow"
import { Pressable, ScrollView, View } from "react-native"
import { Icon } from "components/Icon"
import arrowRightSvg from "assets/exams/arrow_right.svg"
import { usePalette } from "utils/colors"
import {
  ExamStatusType,
  getExamStatus,
  getExamStatusDescription,
  monthsAcronymsEN,
  monthsAcronymsIT,
} from "utils/exams"
import { useCurrentLanguage } from "utils/language"
import { ExamInfoWhiteLine } from "components/Exams/ExamInfoWhiteLine"

/* let searchTimeout: NodeJS.Timeout
const deltaTime = 200 //ms */

enum ExamsStage {
  START,
  TOKEN_FETCHING,
  TOKEN_RETRIEVED,
  ERROR_NOT_LOGGED_IN,
}

const client = HttpClient.getInstance()

export const Exams: MainStackScreen<"Exams"> = props => {
  /* const { t } = useTranslation("exams") */

  const lan = useCurrentLanguage()

  const navigation = useNavigation()

  // ! set to TOKEN RETRIEVED for debug
  const [stage, setStage] = useState(ExamsStage.TOKEN_RETRIEVED)
  const [currentURL, setCurrentURL] = useState<string | undefined>(undefined)
  const polimiAppToken = client.readPolimiAppTokenForExamsTokenRetrieval()
  const { loggedIn, userInfo } = useContext(LoginContext)

  const [teachings, setTeachings] = useState<Teaching[] | undefined>(undefined)

  const [examsWithGradeCount, setExamsWithGradeCount] = useState(0)

  const polimiExamsToken = client.readPolimiExamsToken()

  const { palette } = usePalette()

  // compose start url for redirect flow
  useEffect(() => {
    if (!loggedIn) {
      setStage(ExamsStage.ERROR_NOT_LOGGED_IN)
      return
    } else if (polimiExamsToken) {
      setStage(ExamsStage.TOKEN_RETRIEVED)
    } else if (polimiAppToken) {
      const matricola = userInfo?.careers?.[0]?.matricola ?? ""
      const url = `https://aunicalogin.polimi.it/aunicalogin/getservizioOAuth.xml?lang=IT&al_pj_matricola=${matricola}&polij_style=dark&al_id_srv_chiamante=2428&matricola=${matricola}&id_servizio=2612&returnURL=https%3A%2F%2Fpolimiapp.polimi.it%2Fpolimi_app%2Fapp%2Fexams&access_token=${polimiAppToken.accessToken}`
      setCurrentURL(url)
      setStage(ExamsStage.TOKEN_FETCHING)
    } else {
      //should never happen, user logged in but polimi app token not found
      //in this case prompt user to log in again (?)
      setStage(ExamsStage.ERROR_NOT_LOGGED_IN)
    }
  }, [])

  async function getTeachings() {
    console.log("get teachings")

    // ! uncomment when debug is done
    /* const teachings = await api.exams.getTeachings() */
    const teachings = await fakeTeachings()

    teachings.forEach(teaching => {
      teaching.appelliEsame.sort((a, b) => {
        const dateA = new Date(a.d_app)
        const dateB = new Date(b.d_app)
        return dateA.getTime() - dateB.getTime()
      })
    })

    // ? should we sort teachings according to some criteria?
    /* teachings.sort((a, b) => {
        if (a.appelliEsame.length === 0) return 1
        if (b.appelliEsame.length === 0) return -1

        const dateA = new Date(a.appelliEsame[0].d_app)
        const dateB = new Date(b.appelliEsame[0].d_app)
        return dateA.getTime() - dateB.getTime()
      }) */

    setTeachings(teachings)
  }

  const updateTeachings = () => {
    if (
      props.route.params?.updateTeachings === true &&
      stage === ExamsStage.TOKEN_RETRIEVED
    ) {
      setTeachings(undefined)
      void getTeachings()
      navigation.setParams({ updateTeachings: false })
    }
  }

  useEffect(() => {
    if (stage === ExamsStage.TOKEN_RETRIEVED) {
      void getTeachings()
    }
  }, [stage])

  // when the user navigates back to the exams page, update the teachings
  // if updateTeachings flag is set to true
  useEffect(() => {
    navigation.addListener("focus", updateTeachings)

    return () => {
      navigation.removeListener("focus", updateTeachings)
    }
  }, [props.route.params?.updateTeachings])

  useEffect(() => {
    // count number of exams with grade
    let count = 0
    if (teachings) {
      teachings.forEach(teaching => {
        teaching.appelliEsame.forEach(exam => {
          if (getExamStatus(exam).type == ExamStatusType.ESITO_DISPONIBILE) {
            count++
          }
        })
      })
    }
    setExamsWithGradeCount(count)
  }, [teachings])

  const webview = useRef<WebView>(null)
  return (
    <PageWrap title={"Exams"}>
      {stage === ExamsStage.TOKEN_FETCHING && currentURL ? (
        <WebView
          ref={webview}
          androidLayerType="software"
          containerStyle={{
            flex: 1,
            position: "absolute", // hide
          }}
          originWhitelist={["*"]}
          source={{ uri: currentURL }}
          javaScriptEnabled={true}
          onNavigationStateChange={async ({ url, loading }) => {
            // intercept the state change in the webview
            if (loading) return
            if (!url) return
            if (url.includes("&code")) {
              const authCode = url.split("&code=")[1]
              console.log(authCode)

              try {
                const token = await api.auth.getPolimiExamsToken({
                  authcode: authCode,
                })
                void client.setExamsToken(token)

                setStage(ExamsStage.TOKEN_RETRIEVED)
              } catch (e) {
                console.log(e)
                setStage(ExamsStage.ERROR_NOT_LOGGED_IN)
              }
            }
          }}
        />
      ) : stage === ExamsStage.TOKEN_RETRIEVED ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          bounces={false}
        >
          {teachings && (
            <Pressable
              onPress={() => {
                navigation.navigate("Results", { teachings: teachings })
              }}
            >
              <View
                style={{
                  backgroundColor: palette.primary,
                  borderRadius: 16,
                  height: 52,
                  marginHorizontal: 16,
                  marginBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }} />
                <BodyText
                  style={{
                    color: "#fff",
                    fontWeight: "900",
                    fontSize: 16,
                  }}
                >
                  ESITI
                </BodyText>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <View
                    style={{
                      height: 28,
                      width: 28,
                      borderRadius: 14,
                      backgroundColor: palette.accent,
                      marginRight: 16,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BodyText
                      style={{
                        fontSize: 16,
                        fontWeight: "900",
                        color: palette.primary,
                      }}
                    >
                      {examsWithGradeCount}
                    </BodyText>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
          {teachings?.map((teaching, i) =>
            teaching.appelliEsame.length === 0 ? null : (
              <View
                key={teaching.c_insegn_piano}
                style={{
                  alignItems: "stretch",
                  marginBottom: 16,
                  marginHorizontal: 16,
                  borderRadius: 16,
                  backgroundColor: palette.lighter,
                }}
              >
                <AdaptiveShadowView
                  style={{ marginBottom: 16 }}
                  contentContainerStyle={{
                    backgroundColor: palette.primary,
                    height: 52,
                    flex: 1,
                    paddingVertical: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 16,
                  }}
                  shadow={{ offset: { y: 4 }, opacity: 0.25, blur: 4 }}
                >
                  <Pressable
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      navigation.navigate("TeachingDetails", {
                        teaching,
                      })
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 16,
                      }}
                    >
                      <BodyText
                        style={{
                          fontWeight: "900",
                          color: "white",
                          fontSize: 16,
                          flex: 1,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {teachings?.[i].xdescrizione}
                      </BodyText>

                      <Icon source={arrowRightSvg} scale={1.2} />
                    </View>
                  </Pressable>
                </AdaptiveShadowView>
                {teachings?.[i].appelliEsame?.map(exam => {
                  const dateExam = new Date(exam.d_app)

                  const day = dateExam.getDate()

                  const month =
                    lan === "it"
                      ? monthsAcronymsIT[dateExam.getMonth()]
                      : monthsAcronymsEN[dateExam.getMonth()]

                  const year = dateExam.getFullYear()

                  const status = getExamStatus(exam)
                  return (
                    <View
                      key={exam.c_appello}
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        marginBottom: 16,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
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
                        </BodyText>
                        <BodyText
                          style={{
                            marginRight: 16,
                            color: status.isHighlighted
                              ? palette.accent
                              : "#fff",
                            fontSize: 12,
                            fontWeight: "900",
                          }}
                        >
                          {getExamStatusDescription(
                            status.type,
                            lan,
                          ).toUpperCase()}
                        </BodyText>
                      </View>
                      {status.type === ExamStatusType.ISCRITTO && (
                        // ! add onPress
                        <ExamInfoWhiteLine exam={exam} type={status.type} />
                      )}
                    </View>
                  )
                })}
              </View>
            ),
          )}
        </ScrollView>
      ) : stage === ExamsStage.ERROR_NOT_LOGGED_IN ? (
        <BodyText
          onPress={() =>
            navigation.navigate("Results", { teachings: teachings ?? [] })
          }
        >
          Error logged in
        </BodyText>
      ) : stage === ExamsStage.START ? (
        <BodyText>Start</BodyText>
      ) : null}
    </PageWrap>
  )
}
