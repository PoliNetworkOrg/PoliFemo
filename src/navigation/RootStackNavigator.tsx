/**
 * Root Stack Navigator.
 * Component encapsulating the pages of the app.
 */

import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { RootStackNavigatorParams } from "navigation/NavigationTypes"
import { Home } from "pages/Home"
import { NewsHighlights } from "pages/NewsHighlights"
import { SalutoConBottone } from "pages/SalutoConBottone"

// eslint-disable-next-line @typescript-eslint/naming-convention
const RootStackNavigator = createStackNavigator<RootStackNavigatorParams>()

export const RootStack = () => {
    return (
        <RootStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <RootStackNavigator.Screen name="Home" component={Home} />
            <RootStackNavigator.Screen
                name="Saluti"
                component={SalutoConBottone}
            />
            <RootStackNavigator.Screen
                name="NewsHighlights"
                component={NewsHighlights}
            />
        </RootStackNavigator.Navigator>
    )
}
