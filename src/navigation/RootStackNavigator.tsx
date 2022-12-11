/**
 * Root Stack Navigator.
 * Component encapsulating the pages of the app.
 */

import React, { FC } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { RootStackNavigatorParams } from "navigation/NavigationTypes"
import { Home } from "pages/Home"
import { Article } from "pages/ArticleDetails"
import { NewsList } from "pages/NewsList"
import { Error404 } from "pages/Error404"
import { SettingsPage } from "pages/SettingsPage"
import { NavigationState } from "@react-navigation/native"
import { getCurrentRouteName } from "utils/navigation"
// eslint-disable-next-line @typescript-eslint/naming-convention
const RootStackNavigator = createStackNavigator<RootStackNavigatorParams>()

export const RootStack: FC<{
    onShowTray: (value: boolean) => void
}> = props => {
    return (
        <RootStackNavigator.Navigator
            screenOptions={{ headerShown: false }}
            screenListeners={{
                //this is called every time a new route is pushed or popped
                state: e => {
                    const event = e.data as { state: NavigationState }
                    const route = getCurrentRouteName(event.state.routes)
                    //if current route is "Settings" hide tray
                    if (route === "Settings") {
                        props.onShowTray(false)
                    } else {
                        props.onShowTray(true)
                    }
                },
            }}
        >
            <RootStackNavigator.Screen name="Home" component={Home} />
            <RootStackNavigator.Screen name="Article" component={Article} />
            <RootStackNavigator.Screen name="NewsList" component={NewsList} />
            <RootStackNavigator.Screen name="Error404" component={Error404} />
            <RootStackNavigator.Screen
                name="Settings"
                component={SettingsPage}
            />
        </RootStackNavigator.Navigator>
    )
}
