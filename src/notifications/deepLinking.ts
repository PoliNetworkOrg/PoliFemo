/* eslint-disable @typescript-eslint/naming-convention */
import { LinkingOptions } from "@react-navigation/native"
import { RootStackNavigatorParams } from "navigation/NavigationTypes"
import { Linking } from "react-native"
import * as Notifications from "expo-notifications"

export const linking: LinkingOptions<RootStackNavigatorParams> = {
  config: {
    screens: {
      MainNav: {
        path: "/mainNav",
        screens: {
          Home: "/home",
          Article: "/article",
          OtherCategories: "/other",
          ArticlesList: "/articleList",
          Error404: "/error",
          Groups: "/groups",
          Notifications: "notifications",
          NotificationDetails: "/notificationsDetails",
        },
      },
      SettingsNav: {
        path: "/settingsNav",
        screens: {
          Settings: "/settings",
          About: "/about",
          Licenses: "/licenses",
          Privacy: "/privacy",
        },
      },
      Login: "/login",
    },
  },
  async getInitialURL() {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL()

    if (url != null) {
      return url
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newUrl = response?.notification.request.content.data.url
    if (newUrl && typeof newUrl === "string") {
      return newUrl
    }
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url)

    // Listen to incoming links from deep linking
    const listenerSub = Linking.addEventListener("url", onReceiveURL)

    // Listen to expo notifications, we use this handler only for deepLinking
    const expoNotificationSubscription =
      Notifications.addNotificationResponseReceivedListener(response => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const url = response?.notification.request.content.data.url

        // Any custom logic to see whether the URL needs to be handled
        //...
        // Let React Navigation handle the URL

        if (url && typeof url === "string") {
          listener(url)
        }
      })

    return () => {
      // Clean up the event listeners
      listenerSub.remove()
      expoNotificationSubscription.remove()
    }
  },
  prefixes: [
    "polifemo://", // App-specific scheme
  ],
}
