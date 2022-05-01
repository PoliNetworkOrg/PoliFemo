/**
 * Root Stack Navigator.
 * Component encapsulating the pages of the app.
 */

import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { RootStackNavigatorParams } from "./NavigationTypes"
import { Home } from "../pages/Home"
import { SalutoConBottone } from "../pages/SalutoConBottone"

const RootStackNavigator = createStackNavigator<RootStackNavigatorParams>()

export const RootStack = () => {
    return (
        <RootStackNavigator.Navigator>
            <RootStackNavigator.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
            <RootStackNavigator.Screen
                name="Saluti"
                component={SalutoConBottone}
            />
        </RootStackNavigator.Navigator>
    )
}
