import { RootStackScreen } from "navigation/NavigationTypes"
import React, { useEffect, useRef, useState } from "react"
import { View } from "react-native"
import { Subtitle, Title } from "components/Text"
import WebView from "react-native-webview"
import { usePalette } from "utils/colors"
import { api } from "api"

const magicLoginUrl =
    "https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=92602f24-dd8e-448e-a378-b1c575310f9d&scope=openid%20offline_access&response_type=code&login_hint=nome.cognome@mail.polimi.it&state=10010&redirect_uri=https://api.polinetwork.org/v1/auth/code"
const magicTokenUrl =
    "https://oauthidp.polimi.it/oauthidp/oauth2/auth?response_type=token&client_id=9978142015&client_secret=61760&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=openid+865+aule+orario+rubrica+guasti+appelli+prenotazione+code+notifiche+esami+carriera+chat+webeep&access_type=offline"

const polinetworkTargetUrl = "https://api.polinetwork.org/v1/auth/code"
const polimiTargetUrl = "https://oauthidp.polimi.it/oauthidp/oauth2/postLogin"

enum LoginStage {
    LOGGING_IN,
    GOT_POLINETWORK_TOKEN,
    GOT_POLIMI_CODE,
    GOT_POLIMI_TOKEN,
}

const loginMessage: Record<LoginStage, string> = {
    [LoginStage.LOGGING_IN]: "Logging in...",
    [LoginStage.GOT_POLINETWORK_TOKEN]: "Contacting magic elves...",
    [LoginStage.GOT_POLIMI_CODE]: "Almost there...",
    [LoginStage.GOT_POLIMI_TOKEN]: "All done!",
}

export const Login: RootStackScreen<"Login"> = () => {
    const { backgroundSecondary } = usePalette()
    const webview = useRef<WebView>(null)
    const [loginStage, setLoginStage] = useState(LoginStage.LOGGING_IN)

    const [currentURL, setCurrentURL] = useState(magicLoginUrl)

    useEffect(() => {
        console.log(`Login stage: ${LoginStage[loginStage]}`)
    }, [loginStage])

    return (
        <View style={{ flex: 1, paddingTop: 50 }}>
            <Title>Login</Title>
            <WebView
                ref={webview}
                containerStyle={{
                    flex: 1,
                    borderWidth: 4,
                    borderColor: "red",
                    position:
                        loginStage === LoginStage.LOGGING_IN
                            ? "relative"
                            : "absolute",
                }}
                originWhitelist={["*"]}
                source={{
                    uri: currentURL,
                }}
                javaScriptEnabled={true}
                onMessage={async e => {
                    console.log("recieved message!")
                    const { url, data } = e.nativeEvent
                    if (!url || !data) return

                    if (url.startsWith(polinetworkTargetUrl)) {
                        setCurrentURL(magicTokenUrl)
                    } else if (
                        url.includes(polimiTargetUrl) &&
                        !data.startsWith("ticket")
                    ) {
                        console.log(await api.getPolimiToken(data))
                        setLoginStage(LoginStage.GOT_POLIMI_TOKEN)
                    }
                }}
                onNavigationStateChange={newNavState => {
                    const { url } = newNavState
                    if (!url) return
                    if (url.startsWith(polinetworkTargetUrl)) {
                        // when the polinetwork page is reached, hide the webview and extract the token
                        setLoginStage(LoginStage.GOT_POLINETWORK_TOKEN)
                        webview.current?.injectJavaScript(
                            "window.ReactNativeWebView.postMessage(document.body.innerText)"
                        )
                    } else if (url.startsWith(polimiTargetUrl)) {
                        // when the polimi page is reached, extract the other token
                        setLoginStage(LoginStage.GOT_POLIMI_CODE)
                        webview.current?.injectJavaScript(
                            "window.ReactNativeWebView.postMessage(document.querySelector('input').value)"
                        )
                    }
                }}
            />
            {loginStage !== LoginStage.LOGGING_IN ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: backgroundSecondary,
                    }}
                >
                    <Subtitle>{loginMessage[loginStage]}</Subtitle>
                    <Subtitle>😬</Subtitle>
                </View>
            ) : undefined}
        </View>
    )
}
