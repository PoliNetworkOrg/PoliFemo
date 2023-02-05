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
import { AccountData } from "pages/settings/privacy/AccountData"
import { DeleteAccount } from "pages/settings/privacy/DeleteAccount"
import { AccountSelfDeletion } from "pages/settings/privacy/AccountSelfDeletion"
import { PrivacyPolicy } from "pages/settings/privacy/PrivacyPolicy"
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
            <SettingsStackNavigator.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicy}
            />
            <SettingsStackNavigator.Screen
                name="AccountSelfDeletion"
                component={AccountSelfDeletion}
            />
        </SettingsStackNavigator.Navigator>
    )
}
