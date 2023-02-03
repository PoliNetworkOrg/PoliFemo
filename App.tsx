/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useRef, useState } from "react"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { hideAsync } from "expo-splash-screen"
import { useFonts } from "@expo-google-fonts/roboto"
import {
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_900Black,
} from "@expo-google-fonts/roboto"
import { AppContainer } from "./src/AppContainer"

import { OutsideClickProvider } from "utils/outsideClick"
import { api } from "api"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { LoginContext, LoginState } from "contexts/login"
import { SettingsContext, Settings } from "contexts/settings"
import { useLoadTokens } from "utils/loadTokens"
import { HttpClient } from "api/HttpClient"
import { usePalette } from "utils/colors"

const client = HttpClient.getInstance()

export default function App() {
    const { homeBackground } = usePalette()
    const [settingsReady, setSettingsReady] = useState(false)
    const [settings, setSettings] = useState<Settings>({
        theme: "predefined",
    })

    //tracking first render
    const firstRender = useRef(true)

    // docs: https://docs.expo.dev/versions/latest/sdk/splash-screen/
    useEffect(() => {
        async function prepare() {
            try {
                const settingsJSON = await AsyncStorage.getItem("settings")
                if (settingsJSON) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const parsedSettings: Settings = JSON.parse(settingsJSON)
                    console.log("loaded theme: " + parsedSettings.theme)
                    setSettings(parsedSettings)
                }
            } catch (e) {
                console.warn(e)
            } finally {
                setSettingsReady(true)
            }
        }

        void prepare()
    }, [])

    //Update storage as a side effect of settings change
    useEffect(() => {
        //skip first render
        if (firstRender.current) {
            firstRender.current = false
        } else {
            AsyncStorage.setItem("settings", JSON.stringify(settings)).catch(
                err => console.log(err)
            )
            console.log("Set theme " + settings.theme)
        }
    }, [settings])
    const [fontsLoaded] = useFonts({
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_500Medium_Italic,
        Roboto_700Bold,
        Roboto_900Black,
    })
    const tokensLoaded = useLoadTokens()

    const [loginState, setLoginState] = useState<LoginState>({
        loggedIn: false,
    })

    useEffect(() => {
        // subscribe to the API login events to manage the login state
        const handleLoginEvent = async (loggedIn: boolean) => {
            if (loggedIn) {
                const inf = await api.user.getPolimiUserInfo()
                setLoginState({
                    loggedIn,
                    userInfo: {
                        firstname: inf.nome,
                        lastname: inf.cognome,
                        careers: [
                            {
                                matricola: inf.matricola,
                                type: "Studente TEMP - " + inf.classeCarriera,
                            },
                            { matricola: "222222", type: "Visitatore" },
                            {
                                matricola: "333333",
                                type: "Studente - Titolo Conseguito",
                            },
                            {
                                matricola: "444444",
                                type: "Studente - Magistrale",
                            },
                        ],
                        codPersona: inf.codicePersona,
                        profilePic: inf.fotoURL,
                    },
                })
            } else setLoginState({ loggedIn })
        }

        client.on("login_event", handleLoginEvent)
        return () => {
            client.removeListener("login_event", handleLoginEvent)
        }
    }, [])

    useEffect(() => {
        if (settingsReady && fontsLoaded && tokensLoaded) {
            void hideAsync().then(async () => {
                if (loginState.loggedIn) {
                    console.log(await api.user.getPoliNetworkMe())
                    console.log(await api.user.getPolimiUserInfo())
                }
            })
        }
    }, [settingsReady, fontsLoaded, tokensLoaded])

    if (!settingsReady || !fontsLoaded || !tokensLoaded) return null

    return (
        <NavigationContainer
            theme={{
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    background: homeBackground,
                },
            }}
        >
            <OutsideClickProvider>
                <SettingsContext.Provider
                    value={{ settings: settings, setSettings: setSettings }}
                >
                    <LoginContext.Provider
                        value={{ ...loginState, setLoginState }}
                    >
                        <AppContainer />
                    </LoginContext.Provider>
                </SettingsContext.Provider>
            </OutsideClickProvider>
        </NavigationContainer>
    )
}
