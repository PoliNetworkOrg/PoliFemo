/**
 * Main Stack Navigator.
 * Component encapsulating the pages of the Main Navigator.
 */

import React, { FC } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { MainStackNavigatorParams } from "navigation/NavigationTypes"
import { Home } from "pages/Home"
import { Article } from "pages/ArticleDetails"
import { NewsList } from "pages/NewsList"
import { Error404 } from "pages/Error404"

// eslint-disable-next-line @typescript-eslint/naming-convention
const MainStackNavigator = createStackNavigator<MainStackNavigatorParams>()

export const MainStack: FC = () => {
    return (
        <MainStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <MainStackNavigator.Screen name="Home" component={Home} />
            <MainStackNavigator.Screen name="Article" component={Article} />
            <MainStackNavigator.Screen name="NewsList" component={NewsList} />
            <MainStackNavigator.Screen name="Error404" component={Error404} />
        </MainStackNavigator.Navigator>
    )
}
