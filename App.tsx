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
import { AppSettings } from "./src/state"

export default function App() {
    const [settingsReady, setSettingsReady] = useState(false)
    const [settings, setSettings] = useState(
        new AppSettings({ theme: "predefined" })
    )

    // docs: https://docs.expo.dev/versions/latest/sdk/splash-screen/
    useEffect(() => {
        async function prepare() {
            try {
                await AsyncStorage.getItem("settings")
                    .then(settingsJSON => {
                        if (settingsJSON) {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            const parsedSettings: AppSettings =
                                JSON.parse(settingsJSON)
                            console.log("loaded theme: " + parsedSettings.theme)
                            setSettings(settings.copyWith(parsedSettings))
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } catch (e) {
                console.warn(e)
            } finally {
                setSettingsReady(true)
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
        if (settingsReady && fontsLoaded) {
            await hideAsync()
        }
    }, [settingsReady, fontsLoaded])

    if (!fontsLoaded || !settingsReady) return null

    return (
        <NavigationContainer>
            <AppStateProvider settings={settings} setSettings={setSettings}>
                <OutsideClickProvider>
                    <AppContainer />
                </OutsideClickProvider>
            </AppStateProvider>
        </NavigationContainer>
    )
}
