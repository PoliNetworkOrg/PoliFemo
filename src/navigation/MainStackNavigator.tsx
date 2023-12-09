/**
 * Main Stack Navigator.
 * Component encapsulating the pages of the Main Navigator.
 */

import { MainStackNavigatorParams } from "navigation/NavigationTypes"

import { Home } from "pages/Home"
import { GlobalSearch } from "pages/GlobalSearch"
import { Article } from "pages/news/ArticleDetails"
import { ArticlesList } from "pages/news/ArticlesList"
import { Error404 } from "pages/Error404"
import { BuildingChoice } from "pages/FreeClass/BuildingChoice"
import { CampusChoice } from "pages/FreeClass/CampusChoice"
import { ClassChoice } from "pages/FreeClass/ClassChoice"
import { FreeClassrooms } from "pages/FreeClass/FreeClassrooms"
import { HeadquarterChoice } from "pages/FreeClass/HeadquarterChoice"
import { PositionChoice } from "pages/FreeClass/PositionChoice"
import { RoomDetailsPage } from "pages/FreeClass/RoomDetailsPage"
import { GradingBook } from "pages/GradingBook"
import { Groups } from "pages/Groups"
import { TimeTable } from "pages/TimeTable"
import { OtherCategories } from "pages/news/OtherCategories"
import { NotificationDetails } from "pages/notifications/NotificationDetails"
import { Notifications } from "pages/notifications/Notifications"
import { NotificationsCategory } from "pages/notifications/NotificationsCategory"
import { FC } from "react"
import { createSharedElementStackNavigator } from "react-navigation-shared-element"

// eslint-disable-next-line @typescript-eslint/naming-convention
const MainStackNavigator =
  createSharedElementStackNavigator<MainStackNavigatorParams>()

export const MainStack: FC = () => {
  return (
    <MainStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName="Home"
    >
      <MainStackNavigator.Screen name="Home" component={Home} />
      <MainStackNavigator.Screen name="GlobalSearch" component={GlobalSearch} />
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
      <MainStackNavigator.Screen
        name="Notifications"
        component={Notifications}
      />
      <MainStackNavigator.Screen
        name="NotificationsCategory"
        component={NotificationsCategory}
      />
      <MainStackNavigator.Screen
        name="NotificationDetails"
        component={NotificationDetails}
        options={{
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                opacity: progress,
              },
            }
          },
        }}
        sharedElements={(route, otherRoute, showing) => {
          const { notification } = route.params

          if (otherRoute.name === "Home") {
            return undefined
          }

          if (otherRoute.name === "NotificationsCategory" && !showing) {
            return undefined
          }

          if (otherRoute.name === "NotificationsCategory" && showing) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
            return [notification.identifier]
          }
        }}
      />
      <MainStackNavigator.Screen name="GradingBook" component={GradingBook} />
    </MainStackNavigator.Navigator>
  )
}
