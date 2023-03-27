/**
 * Root Stack Navigator.
 * Component encapsulating the Navigators of the app.
 */

import { FC } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { RootStackNavigatorParams } from "navigation/NavigationTypes"
// ! import with absolute path gives error
import { MainContainer } from "../MainContainer"
import { SettingsContainer } from "../SettingsContainer"
import { Login } from "pages/Login"

// eslint-disable-next-line @typescript-eslint/naming-convention
const RootStackNavigator = createStackNavigator<RootStackNavigatorParams>()

export const RootStack: FC = () => {
  return (
    <RootStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <RootStackNavigator.Screen name="MainNav" component={MainContainer} />
      <RootStackNavigator.Screen
        name="SettingsNav"
        component={SettingsContainer}
      />
      <RootStackNavigator.Screen name="Login" component={Login} />
    </RootStackNavigator.Navigator>
  )
}
