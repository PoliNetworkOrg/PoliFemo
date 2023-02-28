/**
 * Main Stack Navigator.
 * Component encapsulating the pages of the Main Navigator.
 */

import React, { FC } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { MainStackNavigatorParams } from "navigation/NavigationTypes"
import { Home } from "pages/Home"
import { Article } from "pages/news/ArticleDetails"
import { ArticlesList } from "pages/news/ArticlesList"
import { Error404 } from "pages/Error404"
import { OtherCategories } from "pages/news/OtherCategories"
import { Groups } from "pages/Groups"
import { Notifications } from "pages/notifications/Notifications"
import { NotificationsCategory } from "pages/notifications/NotificationsCategory"

// eslint-disable-next-line @typescript-eslint/naming-convention
const MainStackNavigator = createStackNavigator<MainStackNavigatorParams>()

export const MainStack: FC = () => {
  return (
    <MainStackNavigator.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <MainStackNavigator.Screen name="Home" component={Home} />
      <MainStackNavigator.Screen name="Article" component={Article} />
      <MainStackNavigator.Screen name="ArticlesList" component={ArticlesList} />
      <MainStackNavigator.Screen
        name="OtherCategories"
        component={OtherCategories}
      />
      <MainStackNavigator.Screen name="Error404" component={Error404} />
      <MainStackNavigator.Screen name="Groups" component={Groups} />
      <MainStackNavigator.Screen
        name="Notifications"
        component={Notifications}
      />
      <MainStackNavigator.Screen
        name="NotificationsCategory"
        component={NotificationsCategory}
      />
    </MainStackNavigator.Navigator>
  )
}
