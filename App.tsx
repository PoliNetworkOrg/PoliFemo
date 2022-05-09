import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { RootStack } from "./src/navigation/RootStackNavigator"

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function App() {
    return (
        <NavigationContainer>
            <RootStack />
        </NavigationContainer>
    )
}
