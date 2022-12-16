/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
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
import { LoginContext, LoginState } from "utils/login"
import { api, useLoadTokens } from "api"

export default function App() {
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
        api.on("login_event", loggedIn => {
            setLoginState({ loggedIn })
        })
    }, [])

    useEffect(() => {
        if (fontsLoaded && tokensLoaded) void hideAsync()
    }, [fontsLoaded, tokensLoaded])

    if (!fontsLoaded) return null

    return (
        <NavigationContainer>
            <OutsideClickProvider>
                <LoginContext.Provider value={{ ...loginState, setLoginState }}>
                    <AppContainer />
                </LoginContext.Provider>
            </OutsideClickProvider>
        </NavigationContainer>
    )
}
