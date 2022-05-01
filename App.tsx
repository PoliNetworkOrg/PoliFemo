import { NavigationContainer } from "@react-navigation/native"
import React from "react"
import { RootStack } from "./src/navigation/RootStackNavigator"

export default function App() {
    return (
        <NavigationContainer>
            <RootStack />
        </NavigationContainer>
    )
}
