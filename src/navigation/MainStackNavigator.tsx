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
import { FreeClassrooms } from "pages/FreeClass/FreeClassrooms"
import { CampusChoice } from "pages/FreeClass/CampusChoice"
import { PositionChoice } from "pages/FreeClass/PositionChoice"
import { BuildingChoice } from "pages/FreeClass/BuildingChoice"
import { ClassChoice } from "pages/FreeClass/ClassChoice"
import { RoomDetails } from "pages/FreeClass/RoomDetails"
import { Groups } from "pages/Groups"

// eslint-disable-next-line @typescript-eslint/naming-convention
const MainStackNavigator = createStackNavigator<MainStackNavigatorParams>()

export const MainStack: FC = () => {
    return (
        <MainStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <MainStackNavigator.Screen name="Home" component={Home} />
            <MainStackNavigator.Screen name="Article" component={Article} />
            <MainStackNavigator.Screen name="NewsList" component={NewsList} />
            <MainStackNavigator.Screen
                name="FreeClassrooms"
                component={FreeClassrooms}
            />
            <MainStackNavigator.Screen
                name="CampusChoice"
                component={CampusChoice}
            />
            <MainStackNavigator.Screen
                name="PositionChoice"
                component={PositionChoice}
            />
            <MainStackNavigator.Screen
                name="BuildingChoice"
                component={BuildingChoice}
            />
            <MainStackNavigator.Screen
                name="ClassChoice"
                component={ClassChoice}
            />
            <MainStackNavigator.Screen
                name="RoomDetails"
                component={RoomDetails}
            />
            <MainStackNavigator.Screen name="Error404" component={Error404} />
            <MainStackNavigator.Screen name="Groups" component={Groups} />
        </MainStackNavigator.Navigator>
    )
}
