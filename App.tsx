/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { hideAsync } from "expo-splash-screen"
import { useFonts } from "@expo-google-fonts/roboto"
import {
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium_Italic,
    Roboto_900Black,
} from "@expo-google-fonts/roboto"
import { AppContainer } from "./src/AppContainer"

export default function App() {
    const [fontsLoaded] = useFonts({
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_500Medium_Italic,
        Roboto_900Black,
    })

    useEffect(() => {
        if (fontsLoaded) void hideAsync()
    }, [fontsLoaded])

    if (!fontsLoaded) return null

    return (
        <NavigationContainer>
            <AppContainer />
        </NavigationContainer>
    )
}
