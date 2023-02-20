/* eslint-disable prettier/prettier */
/**
 * Settings Stack Navigator.
 * Component encapsulating the pages of the Settings Navigator.
 */

import React, { FC } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { SettingsStackNavigatorParams } from "navigation/NavigationTypes"
import { SettingsPage } from "pages/settings/Settings"
import { About } from "pages/settings/About"
import { Licenses } from "pages/settings/Licenses"
import { Privacy } from "pages/settings/Privacy"
import { PoliMiApp } from "pages/settings/PoliMiApp"

// eslint-disable-next-line @typescript-eslint/naming-convention
const SettingsStackNavigator =
  createStackNavigator<SettingsStackNavigatorParams>()

export const SettingsStack: FC = () => {
  return (
    <SettingsStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStackNavigator.Screen name="Settings" component={SettingsPage} />
      <SettingsStackNavigator.Screen name="About" component={About} />
      <SettingsStackNavigator.Screen name="Licenses" component={Licenses} />
      <SettingsStackNavigator.Screen name="Privacy" component={Privacy} />
      <SettingsStackNavigator.Screen name="PoliMiApp" component={PoliMiApp} />
    </SettingsStackNavigator.Navigator>
  )
}
