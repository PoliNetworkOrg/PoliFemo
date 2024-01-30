import { MainStackScreen } from "navigation/NavigationTypes"

import { BodyText } from "components/Text"

import { PageWrap } from "components/PageLayout"
import WebView from "react-native-webview"
import { useContext, useEffect, useRef, useState } from "react"
import { HttpClient } from "api/HttpClient"
import { LoginContext } from "contexts/login"
import { api } from "api"
import { Teaching } from "api/collections/exams"

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
      console.log(teachings)
      setTeachings(teachings)
    }

    if (stage === ExamsStage.TOKEN_RETRIEVED) {
      void getTeachings()
    }
  }, [stage])

  const webview = useRef<WebView>(null)
  return (
    <PageWrap title={"Exams"}>
      <BodyText>Exams</BodyText>
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
        <BodyText>Token retrieved</BodyText>
      ) : stage === ExamsStage.ERROR_NOT_LOGGED_IN ? (
        <BodyText>Error logged in</BodyText>
      ) : stage === ExamsStage.START ? (
        <BodyText>Start</BodyText>
      ) : null}
    </PageWrap>
  )
}

/* const styles = StyleSheet.create({
  choiceButton: {
    marginTop: 18,
    marginHorizontal: 28,
  },
  choiceContent: {
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 23,
    height: 190,
  },
}) */
