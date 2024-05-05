import { NavBar } from "components/NavBar"
import { Title, Subtitle } from "components/Text"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { useEffect, useRef, useState } from "react"
import { View } from "react-native"
import WebView from "react-native-webview"
import { usePalette } from "utils/colors"
import { Buffer } from "buffer"

const weebeepEntry = "http://webeep.polimi.it/auth/shibboleth/index.php"

const redirectUrl =
  "https://webeep.polimi.it/admin/tool/mobile/launch.php?service=moodle_mobile_app&passport=12345"

enum LoginWebeepStage {
  /**
   * Waiting for the user to go through the login process
   */
  LOGGING_IN,

  /**
   *  token is being retrieved
   */
  RETRIEVING_TOKEN,
  /**
   *  token retrieved
   */
  GOT_TOKEN,
}

const loginMessage: Record<LoginWebeepStage, string> = {
  [LoginWebeepStage.LOGGING_IN]: "Logging in...",
  [LoginWebeepStage.GOT_TOKEN]: "All done!",
  [LoginWebeepStage.RETRIEVING_TOKEN]: "Retrieving token...",
}

/* const client = HttpClient.getInstance() */

export const WebeepLogin: MainStackScreen<"WebeepLogin"> = () => {
  const { navigate } = useNavigation()

  const { backgroundSecondary, homeBackground, palette } = usePalette()

  const webview = useRef<WebView>(null)

  const [loginStage, setLoginStage] = useState(LoginWebeepStage.LOGGING_IN)

  const [currentURL, setCurrentURL] = useState(weebeepEntry)

  const [token, setToken] = useState<string | undefined>()

  useEffect(() => {
    console.log(`Login stage: ${LoginWebeepStage[loginStage]}`)
  }, [loginStage])

  useEffect(() => {
    if (token) {
      console.log("Login completed! Registering tokens...")
      navigate("WebeepCourses")
    }
  }, [token])

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 50,
        backgroundColor: homeBackground,
      }}
    >
      <Title
        style={{
          color: palette.accent,
          paddingLeft: 20,
        }}
      >
        Login
      </Title>
      <WebView
        ref={webview}
        androidLayerType="software"
        containerStyle={{
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position:
            loginStage === LoginWebeepStage.LOGGING_IN // hide after credentials are set
              ? "relative"
              : "absolute",
        }}
        originWhitelist={["*"]}
        source={{ uri: currentURL }}
        javaScriptEnabled={true}
        onNavigationStateChange={({ url, loading }) => {
          console.log("Navigating to", url)
          // intercept the state change in the webview
          if (loading) return
          if (!url) return

          if (url.includes("webeep.polimi.it/my/")) {
            // redirect to redirectUrl
            // ! I get a warning loading this page, maybe should just inject fetch?
            setCurrentURL(redirectUrl)
            setLoginStage(LoginWebeepStage.RETRIEVING_TOKEN)
          } else if (url.includes("token=")) {
            const b64token = url.split("token=")[1]

            // ? why is it composed of three parts? is it like access token expiration date and refresh token?
            const fullToken = Buffer.from(b64token, "base64").toString("utf-8")

            const token = fullToken.split(":::")[1]
            setToken(token)
            setLoginStage(LoginWebeepStage.GOT_TOKEN)
          }
        }}
      />
      {loginStage !== LoginWebeepStage.LOGGING_IN ? (
        <View
          // what to show when proceeding with the hidden login steps
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: backgroundSecondary,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <Subtitle>{loginMessage[loginStage]}</Subtitle>
        </View>
      ) : undefined}
      <NavBar />
    </View>
  )
}
