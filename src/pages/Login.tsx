import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import React, { useEffect, useRef, useState } from "react"
import { View } from "react-native"
import { Subtitle, Title } from "components/Text"
import WebView from "react-native-webview"
import { usePalette } from "utils/colors"
import { api, client } from "api"
import { PolimiToken, PoliNetworkToken } from "utils/login"
import { NavBar } from "components/NavBar"

// TODO: HANDLE ERRORS, this will break as soon as something goes wrong
// the flow should be probably stopped when something goes wrong and the user should be prompted

// absolute magic url that makes the login go brrr, going to this url prompts the user to log in
// for microsoft sso using polimi creditials
const magicLoginUrl =
    "https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=92602f24-dd8e-448e-a378-b1c575310f9d&scope=openid%20offline_access&response_type=code&login_hint=nome.cognome@mail.polimi.it&state=10010&redirect_uri=https://api.polinetwork.org/v1/auth/code"
// with a polimi session present, this cascade-redirects to the app page with the authcode attached
const magicTokenUrl =
    "https://oauthidp.polimi.it/oauthidp/oauth2/auth?client_id=1057407812&redirect_uri=https%3A%2F%2Fpolimiapp.polimi.it%2Fpolimi_app%2Fapp&scope=openid%20polimi_app%20aule%20policard%20incarichi%20orario%20account%20webmail%20faqappmobile%20rubrica%20richass%20guasti%20prenotazione%20code%20carriera%20alumni%20webeep%20teamwork%20esami&access_type=offline&response_type=code"

// if this is reached we have reached the polinework access token
const polinetworkTargetUrl = "https://api.polinetwork.org/v1/auth/code"
// once this is reached we can extract polimi authcode from the url
const polimiTargetUrl = "https://polimiapp.polimi.it/polimi_app/app/?code="

enum LoginStage {
    /**
     * Waiting for the user to go through the login process
     */
    LOGGING_IN,
    /**
     * PoliNetwork access token retrieved, redirecting to get Polimi AuthCode
     */
    GOT_POLINETWORK_TOKEN,
    /**
     * Polimi AuthCode retrieved, the web part is done, fetching the access token
     */
    GOT_POLIMI_CODE,
    /**
     * Polimi access token retrieved, both tokens are set, login is completed
     */
    GOT_POLIMI_TOKEN,
}

const loginMessage: Record<LoginStage, string> = {
    [LoginStage.LOGGING_IN]: "Logging in...",
    [LoginStage.GOT_POLINETWORK_TOKEN]: "Retrieving Polimi AuthCode...",
    [LoginStage.GOT_POLIMI_CODE]: "Retrieving Polimi access token...",
    [LoginStage.GOT_POLIMI_TOKEN]: "All done!",
}

/**
 * The login page, has a webview for the login info and logic for managing the login flow
 *
 * First the user logs into the polinetwork account using polimi credentials, then once the polimi
 * session is set and the polinetwork token is retrieved the webview is hiddent and redirects are
 * forced to retrieve polimi authcode, which is used to get a fresh access token
 */
export const Login: RootStackScreen<"Login"> = () => {
    const navigation = useNavigation()
    const { backgroundSecondary, homeBackground, palette } = usePalette()
    const webview = useRef<WebView>(null)

    // keeps track of wich stage of the login we are on
    const [loginStage, setLoginStage] = useState(LoginStage.LOGGING_IN)

    // used to force a redirect when polinetwork token is reached
    const [currentURL, setCurrentURL] = useState(magicLoginUrl)

    // temporarly save the tokens in the state when they are retrieved
    const [poliNetworkToken, setPoliNetworkToken] = useState<
        PoliNetworkToken | undefined
    >()
    const [polimiToken, setPolimiToken] = useState<PolimiToken | undefined>()

    useEffect(() => {
        console.log(`Login stage: ${LoginStage[loginStage]}`)
    }, [loginStage])

    useEffect(() => {
        // when both tokens are locally set, we are done!
        // the tokens should get registered in the api wrapper to be used in calls
        if (poliNetworkToken && polimiToken) {
            console.log("Login completed! Registering tokens...")
            void client
                .setTokens({ poliNetworkToken, polimiToken })
                .then(() => {
                    setTimeout(() => {
                        navigation.goBack()
                    }, 1000)
                })
        }
    }, [poliNetworkToken, polimiToken])

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
                        loginStage === LoginStage.LOGGING_IN // hide after credentials are set
                            ? "relative"
                            : "absolute",
                }}
                originWhitelist={["*"]}
                source={{ uri: currentURL }}
                javaScriptEnabled={true}
                onMessage={e => {
                    // the JSON body of the PoliNetwork token is sent via a message
                    const { url, data } = e.nativeEvent
                    if (!url || !data) return

                    if (url.startsWith(polinetworkTargetUrl)) {
                        try {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                            setPoliNetworkToken(JSON.parse(data))
                            setCurrentURL(magicTokenUrl)
                        } catch (e) {
                            console.log("error while parsing!!")
                            console.log(url)
                            console.log(data)
                        }
                    }
                }}
                onNavigationStateChange={async ({ url, loading }) => {
                    // intercept the state change in the webview
                    if (loading) return
                    if (!url) return

                    if (url.startsWith(polinetworkTargetUrl)) {
                        // when the polinetwork page is reached, hide the webview and extract the token
                        setLoginStage(LoginStage.GOT_POLINETWORK_TOKEN)
                        webview.current?.injectJavaScript(
                            "window.ReactNativeWebView.postMessage(document.body.innerText)"
                        )
                    } else if (url.startsWith(polimiTargetUrl)) {
                        // when the polimi page is reached, extract the other token from the url
                        const authcode = url.replace(polimiTargetUrl, "")
                        setLoginStage(LoginStage.GOT_POLIMI_CODE)

                        // retrieve the access token from the authcode
                        const token = await api.auth.getPolimiToken(authcode)
                        setPolimiToken(token)
                        setLoginStage(LoginStage.GOT_POLIMI_TOKEN)
                    }
                }}
            />
            {loginStage !== LoginStage.LOGGING_IN ? (
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
