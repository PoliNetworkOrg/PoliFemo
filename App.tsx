/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useState } from "react"
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

import AsyncStorage from "@react-native-async-storage/async-storage"
import { AppStateProvider } from "./src/state"
import { AppState } from "./src/state"

export default function App() {
    const [themeIsReady, setThemeIsReady] = useState(false)
    const [theme, setTheme] = useState("predefined")
    const state = new AppState({ theme: theme, setTheme: setTheme })

    // docs: https://docs.expo.dev/versions/latest/sdk/splash-screen/
    useEffect(() => {
        async function prepare() {
            try {
                await AsyncStorage.getItem("theme")
                    .then(themeJSON => {
                        if (themeJSON) {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            const parsedTheme: string = JSON.parse(themeJSON)
                            console.log("loaded theme: " + theme)
                            setTheme(parsedTheme)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } catch (e) {
                console.warn(e)
            } finally {
                setThemeIsReady(true)
            }
        }

        void prepare()
    }, [])

    const [fontsLoaded] = useFonts({
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_500Medium_Italic,
        Roboto_700Bold,
        Roboto_900Black,
    })

    useCallback(async () => {
        if (themeIsReady && fontsLoaded) {
            // This tells the splash screen to hide immediately!
            await hideAsync()
        }
    }, [themeIsReady, fontsLoaded])

    if (!fontsLoaded || !themeIsReady) return null

    return (
        <NavigationContainer>
            <AppStateProvider state={state}>
                <OutsideClickProvider>
                    <AppContainer />
                </OutsideClickProvider>
            </AppStateProvider>
        </NavigationContainer>
    )
}
