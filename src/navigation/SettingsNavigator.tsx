/**
 * Settings Stack Navigator.
 * Component encapsulating the pages of the Settings Navigator.
 */

import React, { FC } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { SettingsStackNavigatorParams } from "navigation/NavigationTypes"
import { SettingsPage } from "pages/Settings"
import { Help } from "pages/Help"
// eslint-disable-next-line @typescript-eslint/naming-convention
const SettingsStackNavigator =
    createStackNavigator<SettingsStackNavigatorParams>()

export const SettingsStack: FC = () => {
    return (
        <SettingsStackNavigator.Navigator
            screenOptions={{ headerShown: false }}
        >
            <SettingsStackNavigator.Screen
                name="Settings"
                component={SettingsPage}
            />
            <SettingsStackNavigator.Screen name="Help" component={Help} />
        </SettingsStackNavigator.Navigator>
    )
}
