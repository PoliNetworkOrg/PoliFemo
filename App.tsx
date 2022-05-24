/* eslint-disable @typescript-eslint/naming-convention */
import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import AppLoading from "expo-app-loading"
import { RootStack } from "./src/navigation/RootStackNavigator"
import { useFonts } from "@expo-google-fonts/roboto"
import {
    Roboto_400Regular,
    Roboto_500Medium_Italic,
    Roboto_900Black,
} from "@expo-google-fonts/roboto"

export default function App() {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium_Italic,
        Roboto_900Black,
    })

    if (!fontsLoaded) return <AppLoading />

    return (
        <NavigationContainer>
            <RootStack />
        </NavigationContainer>
    )
}
