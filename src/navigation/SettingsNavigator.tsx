/**
 * Settings Stack Navigator.
 * Component encapsulating the pages of the Settings Navigator.
 */

import React, { FC } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { SettingsStackNavigatorParams } from "navigation/NavigationTypes"
import { SettingsPage } from "pages/settings/Settings"
import { Help } from "pages/settings/Help"
import { Privacy } from "pages/settings/Privacy"
import { AccountData } from "pages/settings/AccountData"
import { DeleteAccount } from "pages/settings/DeleteAccount"
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
            <SettingsStackNavigator.Screen name="Privacy" component={Privacy} />
            <SettingsStackNavigator.Screen
                name="AccountData"
                component={AccountData}
            />
            <SettingsStackNavigator.Screen
                name="DeleteAccount"
                component={DeleteAccount}
            />
        </SettingsStackNavigator.Navigator>
    )
}
