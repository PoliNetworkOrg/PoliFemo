/**
 * Root Stack Navigator.
 * Component encapsulating the pages of the app.
 */

import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { RootStackNavigatorParams } from "navigation/NavigationTypes"
import { Home } from "pages/Home"
import { Article } from "pages/ArticleDetails"
import { NewsList } from "pages/NewsList"
import { Error404 } from "pages/Error404"
import { FreeClassrooms } from "pages/FreeClass/FreeClassrooms"
import { CampusChoice } from "pages/FreeClass/CampusChoice"
import { PositionChoice } from "pages/FreeClass/PositionChoice"

// eslint-disable-next-line @typescript-eslint/naming-convention
const RootStackNavigator = createStackNavigator<RootStackNavigatorParams>()

export const RootStack = () => {
    return (
        <RootStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <RootStackNavigator.Screen name="Home" component={Home} />
            <RootStackNavigator.Screen name="Article" component={Article} />
            <RootStackNavigator.Screen name="NewsList" component={NewsList} />
            <RootStackNavigator.Screen name="Error404" component={Error404} />
            <RootStackNavigator.Screen
                name="FreeClassrooms"
                component={FreeClassrooms}
            />
            <RootStackNavigator.Screen
                name="CampusChoice"
                component={CampusChoice}
            />
            <RootStackNavigator.Screen
                name="PositionChoice"
                component={PositionChoice}
            />
        </RootStackNavigator.Navigator>
    )
}
