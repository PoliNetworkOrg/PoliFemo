import { MainStackScreen } from "navigation/NavigationTypes"

import { BodyText } from "components/Text"

import { PageWrap } from "components/PageLayout"
import WebView from "react-native-webview"
import { useContext, useEffect, useRef, useState } from "react"
import { HttpClient } from "api/HttpClient"
import { LoginContext } from "contexts/login"
import { api } from "api"
import { Teaching } from "api/collections/exams"
import { AdaptiveShadowView } from "components/BoxShadow"
import { Pressable, ScrollView, View } from "react-native"
import { Icon } from "components/Icon"
import arrowRightSvg from "assets/exams/arrow_right.svg"
import { palette } from "utils/colors"
import { getExamStatus, monthsAcronymsEN, monthsAcronymsIT } from "utils/exams"
import { useCurrentLanguage } from "utils/language"

/* let searchTimeout: NodeJS.Timeout
const deltaTime = 200 //ms */

enum ExamsStage {
  START,
  TOKEN_FETCHING,
  TOKEN_RETRIEVED,
  ERROR_NOT_LOGGED_IN,
}

const client = HttpClient.getInstance()

export const Exams: MainStackScreen<"Exams"> = () => {
  /* const { t } = useTranslation("exams") */

  const lan = useCurrentLanguage()

  const [stage, setStage] = useState(ExamsStage.START)
  const [currentURL, setCurrentURL] = useState<string | undefined>(undefined)
  const polimiAppToken = client.readPolimiAppTokenForExamsTokenRetrieval()
  const { loggedIn, userInfo } = useContext(LoginContext)

  const [teachings, setTeachings] = useState<Teaching[] | undefined>(undefined)

  const polimiExamsToken = client.readPolimiExamsToken()

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

  useEffect(() => {
    async function getTeachings() {
      const teachings = await api.exams.getTeachings()

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

    if (stage === ExamsStage.TOKEN_RETRIEVED) {
      void getTeachings()
    }
  }, [stage])

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
                  <View
                    style={{
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
                    <Pressable
                      style={{
                        width: 40,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Icon source={arrowRightSvg} scale={1.2} />
                    </Pressable>
                  </View>
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
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 16,
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
                          color: status.isHighlighted ? palette.accent : "#fff",
                          fontSize: 12,
                          fontWeight: "900",
                        }}
                      >
                        {status.desc.toUpperCase()}
                      </BodyText>
                    </View>
                  )
                })}
              </View>
            )
          )}
        </ScrollView>
      ) : stage === ExamsStage.ERROR_NOT_LOGGED_IN ? (
        <BodyText>Error logged in</BodyText>
      ) : stage === ExamsStage.START ? (
        <BodyText>Start</BodyText>
      ) : null}
    </PageWrap>
  )
}
