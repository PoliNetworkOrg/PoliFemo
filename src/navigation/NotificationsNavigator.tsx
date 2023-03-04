/**
 * Notifications Stack Navigator.
 * Component encapsulating the pages of the Notifications Navigator.
 */

import React, { FC } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { NotificationsStackNavigatorParams } from "navigation/NavigationTypes"
import { NotificationsPage } from "pages/notifications/Notifications"

// eslint-disable-next-line @typescript-eslint/naming-convention
const NotificationsStackNavigator =
  createStackNavigator<NotificationsStackNavigatorParams>()

export const NotificationsStack: FC = () => {
  return (
    <NotificationsStackNavigator.Navigator
      screenOptions={{ headerShown: false }}
    >
      <NotificationsStackNavigator.Screen
        name="Notifications"
        component={NotificationsPage}
      />
    </NotificationsStackNavigator.Navigator>
  )
}
