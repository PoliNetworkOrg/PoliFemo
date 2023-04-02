/**
 * Main Stack Navigator.
 * Component encapsulating the pages of the Main Navigator.
 */

import { FC } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { MainStackNavigatorParams } from "navigation/NavigationTypes"
import { Home } from "pages/Home"
import { Article } from "pages/news/ArticleDetails"
import { ArticlesList } from "pages/news/ArticlesList"
import { Error404 } from "pages/Error404"
import { FreeClassrooms } from "pages/FreeClass/FreeClassrooms"
import { CampusChoice } from "pages/FreeClass/CampusChoice"
import { PositionChoice } from "pages/FreeClass/PositionChoice"
import { BuildingChoice } from "pages/FreeClass/BuildingChoice"
import { ClassChoice } from "pages/FreeClass/ClassChoice"
import { RoomDetailsPage } from "pages/FreeClass/RoomDetailsPage"
import { OtherCategories } from "pages/news/OtherCategories"
import { Groups } from "pages/Groups"
import { HeadquarterChoice } from "pages/FreeClass/HeadquarterChoice"
import { TimeTable } from "pages/TimeTable"

// eslint-disable-next-line @typescript-eslint/naming-convention
const MainStackNavigator = createStackNavigator<MainStackNavigatorParams>()

export const MainStack: FC = () => {
  return (
    <MainStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <MainStackNavigator.Screen name="Home" component={Home} />
      <MainStackNavigator.Screen name="Article" component={Article} />
      <MainStackNavigator.Screen name="ArticlesList" component={ArticlesList} />
      <MainStackNavigator.Screen
        name="OtherCategories"
        component={OtherCategories}
      />

      <MainStackNavigator.Screen
        name="FreeClassrooms"
        component={FreeClassrooms}
      />
      <MainStackNavigator.Screen
        name="HeadquarterChoice"
        component={HeadquarterChoice}
      />
      <MainStackNavigator.Screen name="CampusChoice" component={CampusChoice} />
      <MainStackNavigator.Screen
        name="PositionChoice"
        component={PositionChoice}
      />
      <MainStackNavigator.Screen
        name="BuildingChoice"
        component={BuildingChoice}
      />
      <MainStackNavigator.Screen name="ClassChoice" component={ClassChoice} />
      <MainStackNavigator.Screen
        name="RoomDetails"
        component={RoomDetailsPage}
      />
      <MainStackNavigator.Screen name="Error404" component={Error404} />
      <MainStackNavigator.Screen name="Groups" component={Groups} />
      <MainStackNavigator.Screen name="TimeTable" component={TimeTable} />
    </MainStackNavigator.Navigator>
  )
}
