/* eslint-disable @typescript-eslint/naming-convention */
import { Subscription } from "expo-clipboard"
import * as Notifications from "expo-notifications"
import {
  AndroidImportance,
  NotificationContentInput,
  NotificationTriggerInput,
} from "expo-notifications"
import { useEffect, useRef } from "react"
import { CarouselItem, WidgetType } from "./carousel"
import { LinkingOptions } from "@react-navigation/native"
import { RootStackNavigatorParams } from "navigation/NavigationTypes"
import { Linking } from "react-native"

export interface ScheduledNotificationInfo {
  eventId: number
  identifier: string
}

/**
 * If events starts at 14:00, send notification at 13:30
 */
const MINUTES_BEFORE_EVENT = 30
const DELTA_MILLISECONDS = MINUTES_BEFORE_EVENT * 60 * 1000

export const inizializeNotificationHandler = () =>
  Notifications.setNotificationHandler({
    // eslint-disable-next-line @typescript-eslint/require-await
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  })

// ? Android only, not clear what it should do in terms of differences in the message
// probably it s only useful for setting importance
export const setNotificationsChannels = async () => {
  try {
    await Notifications.setNotificationChannelAsync("comunicazioni", {
      name: "comunicazioni",
      importance: AndroidImportance.MAX,
    })
    await Notifications.setNotificationChannelAsync("associazioni", {
      name: "associazioni",
      importance: AndroidImportance.MAX,
    })
    await Notifications.setNotificationChannelAsync("upload", {
      name: "upload",
      importance: AndroidImportance.DEFAULT,
    })
  } catch (err) {
    console.log(err)
  }
}

export const InitializeNotificationAppCentre = () => {
  // get notification grant on first app start
  inizializeNotificationHandler()

  void setNotificationsChannels()
}

/**
 *
 * @param content
 * @example
 * ```ts
 *  content: {
 *    title: "You've got mail! 📬",
 *    body: 'Here is the notification body',
 *    data: { eventId : 123, additionalParam : ...  },
 *  },
 *```
 * You can add a `url` param inside `data` to enable deeplinking
 *
 * ```ts
 *  content: {
 *    title: "Titolo",
 *    body: 'Body',
 *    data: { eventId : 123, url: "polifemo://settings_nav/settings"},
 *  },
 *```
 *
 * @param trigger
 * you can also specify Date, see {@link SchedulableNotificationTriggerInput}
 * @example
 * ```ts
 *  trigger: {
 *    seconds: 60,
 *    channelId: "comunicazioni"
 *  },
 *```
 * note: trigger can be null, in that case notification will be sent immediately
 *
 */
export const sendScheduledNotification = async (
  content: NotificationContentInput,
  trigger: NotificationTriggerInput
) => {
  try {
    const grant = await checkPermission()
    if (grant) {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: content,
        trigger: trigger,
      })
      return identifier
    }
  } catch (err) {
    console.log(err)
  }
  //in case of errors, I don't know if they happen, I guess no but not sure
  return undefined
}

/**
 * Initialize handlers in App.tsx, to be used only once when the app starts.
 */
export const useNotificationsHandlers = () => {
  const notificationListener = useRef<Subscription>()
  const responseListener = useRef<Subscription>()

  useEffect(() => {
    //fired when notification pops up in the status bar
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        console.log(
          "received notification request " + notification.request.content.title
        )
      })

    //fired when user taps on notification, evreything is dismissed by default
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        if (
          !response.notification.request.content.data.overrideDismissBehaviour
        ) {
          console.log("dismissing")
          void Notifications.dismissNotificationAsync(
            response.notification.request.identifier
          )
        }
      })

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])
}

/**
 * Removes a notification from schedule, given its identifier
 * @param id identifier
 */
export const removeNotificationFromIdentifier = async (id: string) => {
  try {
    const notifications = await Notifications.getPresentedNotificationsAsync()
    let found = false
    for (let i = 0; i < notifications.length && !found; i++) {
      if (notifications[i].request.identifier === id) {
        await Notifications.cancelScheduledNotificationAsync(id)
        found = true
      }
    }
  } catch (err) {
    console.log(err)
  }
}

interface MinutesBeforeOptions {
  deadline: number
  exam: number
  lecture: number
}

/**
 *
 * @param items
 * @param minutesBefore lets you set how many minutes before the event's start date send the notification
 */
export const checkNeedSchedulingNotifications = async (
  items: CarouselItem[],
  minutesBefore?: MinutesBeforeOptions
) => {
  try {
    const isGrant = await checkPermission()

    if (isGrant) {
      const currentScheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync()

      //for each carousel item check if notification was already scheduled
      for (const item of items) {
        let found = false
        for (
          let i = 0;
          i < currentScheduledNotifications.length && !found;
          i++
        ) {
          if (
            item.id === currentScheduledNotifications[i].content.data.eventId
          ) {
            //already scheduled
            found = true
          }
        }
        if (!found) {
          const deltaMilliseconds = getMinutesBeforeInMilliseconds(
            minutesBefore,
            item.type
          )
          //allow only DEADLINE and EXAMS notifications (?) and if event isn't in the past
          if (
            (item.type === WidgetType.DEADLINE ||
              item.type === WidgetType.EXAMS ||
              item.type === WidgetType.LECTURES) &&
            new Date(item.isoDate).getTime() - deltaMilliseconds > Date.now()
          ) {
            await sendScheduledNotification(
              {
                title: item.title,
                body: `l'evento si svolgerà ${item.date} alle ${item.time}`,
                data: { eventId: item.id },
              },
              {
                date: new Date(
                  new Date(item.isoDate).getTime() - deltaMilliseconds
                ),
              }
            )
          }
        }
      }
    }
  } catch (e) {
    console.warn(e)
  }
}

//DEEP LINKING
// ? use more appropriate names
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
        const url = response.notification.request.content.data.url
        const action = response.actionIdentifier

        // Any custom logic to see whether the URL needs to be handled
        //...
        // Let React Navigation handle the URL

        if (url && action === "link" && typeof url === "string") {
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

// ! this needs testing
export const checkPermission = async () => {
  const settings = await Notifications.getPermissionsAsync()
  if (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true
  } else if (
    settings.status === "undetermined" ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.NOT_DETERMINED
  ) {
    const permission = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    })
    return (
      permission.granted ||
      permission.ios?.status ===
        Notifications.IosAuthorizationStatus.PROVISIONAL
    )
  }
  return false
}

export const notificationsTestingUtils = {
  async logNextTriggerDate() {
    try {
      const nextTriggerDate = await Notifications.getNextTriggerDateAsync(
        new Date(Date.now() + 60 * 60 * 1000)
      )
      console.log(
        nextTriggerDate === null
          ? "No next trigger date"
          : new Date(nextTriggerDate)
      )
    } catch (e) {
      console.warn("Couldn't have calculated next trigger date: " + e)
    }
  },

  async logPermission() {
    const settings = await Notifications.getPermissionsAsync()
    console.log(settings.android)
    console.log(settings.ios)
    console.log(settings.granted)
  },

  async LogAllScheduledNotifications() {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync()
      scheduledNotifications.forEach(notif => {
        console.log(notif.content.title)
      })
    } catch (err) {
      console.log(err)
    }
  },

  async cancelAllScheduledNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync()
      console.log("notifications cancelled")
    } catch (err) {
      console.log(err)
    }
  },

  /**
   * Dismiss all notifications from Tray
   */
  async dismissAllNotifications() {
    try {
      await Notifications.dismissAllNotificationsAsync()
      console.log("dismissed all")
    } catch (err) {
      console.log(err)
    }
  },
}

const getMinutesBeforeInMilliseconds = (
  minutesOption?: MinutesBeforeOptions,
  type?: WidgetType
) => {
  let minutes
  if (type === WidgetType.DEADLINE) {
    minutes = minutesOption?.deadline
  } else if (type === WidgetType.EXAMS) {
    minutes = minutesOption?.exam
  } else if (type === WidgetType.LECTURES) {
    minutes = minutesOption?.lecture
  }
  if (minutes) {
    return minutes * 60 * 1000
  }
  return DELTA_MILLISECONDS
}
