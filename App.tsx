/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useRef, useState } from "react"
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
import { SettingsContext, Settings } from "utils/settings"

export default function App() {
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

    useCallback(async () => {
        if (settingsReady && fontsLoaded) {
            await hideAsync()
        }
    }, [settingsReady, fontsLoaded])

    if (!fontsLoaded || !settingsReady) return null

    return (
        <NavigationContainer>
            <SettingsContext.Provider
                value={{ settings: settings, setSettings: setSettings }}
            >
                <OutsideClickProvider>
                    <AppContainer />
                </OutsideClickProvider>
            </SettingsContext.Provider>
        </NavigationContainer>
    )
}
