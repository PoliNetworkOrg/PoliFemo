/* eslint-disable @typescript-eslint/naming-convention */
import { Subscription } from "expo-clipboard"
import * as Notifications from "expo-notifications"
import {
  AndroidImportance,
  AndroidNotificationVisibility,
  NotificationContentInput,
  NotificationTriggerInput,
} from "expo-notifications"
import { useEffect, useRef } from "react"
import * as TaskManager from "expo-task-manager"
import { CarouselItem, WidgetType } from "./carousel"
import { LinkingOptions } from "@react-navigation/native"
import { RootStackNavigatorParams } from "navigation/NavigationTypes"
import { Linking } from "react-native"

export interface ScheduledNotificationInfo {
  eventId: number
  identifier: string
}

// ? ask Tommaso or desing when notifications should be received
/**
 * If events starts at 14:00, send notification at 13:30
 */
const MINUTES_BEFORE_EVENT = 30

export const inizializeNotificationHandler = () =>
  Notifications.setNotificationHandler({
    // eslint-disable-next-line @typescript-eslint/require-await
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  })

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
        console.log("removed first sub")
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
      }
      if (responseListener.current) {
        console.log("removed second sub")
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])
}

//looks like it's not working. Maybe because of Expo Go?
// ? probably don't even need this for now
export const setBackgroundTaskOnNotifications = () => {
  const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK"

  TaskManager.defineTask(
    BACKGROUND_NOTIFICATION_TASK,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ data, error, executionInfo }) => {
      console.log("Received a notification in the background!")
      console.log(data)
      // Do something with the notification data
    }
  )

  void Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)
}

/**
 * just for testing
 */
export const logNextTriggerDate = async () => {
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
}

/**
 * Removes all scheduled notifications, for testing
 */
export const clearNotifcationCentreTray = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync()
  } catch (err) {
    console.log(err)
  }
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
        await Notifications.dismissNotificationAsync(id)
        found = true
      }
    }
  } catch (err) {
    console.log(err)
  }
}

// ? Android only, not clear what it should do in terms of differences in the message
// probably it s only useful for setting importance
export const setNotificationsChannels = async () => {
  try {
    await Notifications.setNotificationChannelAsync("comunicazioni", {
      name: "comunicazioni",
      importance: AndroidImportance.MAX,
      // Optional attributes
      bypassDnd: false,
      description: "descrizione",
      groupId: "comunicazioni",
      lightColor: undefined,
      lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
      showBadge: true,
      sound: undefined,
      audioAttributes: undefined,
      vibrationPattern: undefined,
      enableLights: undefined,
      enableVibrate: undefined,
    })
    await Notifications.setNotificationChannelAsync("associazioni", {
      name: "associazioni",
      importance: AndroidImportance.MAX,
      // Optional attributes
      bypassDnd: false,
      description: "descrizione",
      groupId: "associazioni",
      lightColor: undefined,
      lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
      showBadge: true,
      sound: undefined,
      audioAttributes: undefined,
      vibrationPattern: undefined,
      enableLights: undefined,
      enableVibrate: undefined,
    })
    await Notifications.setNotificationChannelAsync("upload", {
      name: "upload",
      importance: AndroidImportance.DEFAULT,
      // Optional attributes
      bypassDnd: false,
      description: "descrizione",
      groupId: "upload",
      lightColor: undefined,
      lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
      showBadge: true,
      sound: undefined,
      audioAttributes: undefined,
      vibrationPattern: undefined,
      enableLights: undefined,
      enableVibrate: undefined,
    })
  } catch (err) {
    console.log(err)
  }
}

// ? ask design for type of notifications
export const setNotificationCategories = async () => {
  await Notifications.setNotificationCategoryAsync("action", [
    {
      identifier: "link",
      buttonTitle: "leggi",
      options: { opensAppToForeground: true },
    },
    {
      identifier: "dismiss",
      buttonTitle: "Segna come già letto",
      options: {
        opensAppToForeground: false,
        isDestructive: true,
        isAuthenticationRequired: false,
      },
    },
  ])
  await Notifications.setNotificationCategoryAsync("message", [
    {
      identifier: "identifier",
      buttonTitle: "Manda un messaggio",
      options: {},
      textInput: { placeholder: "scrivi...", submitButtonTitle: "submit" },
    },
  ])
}

/**
 * useful for testing
 */
export const LogAllScheduledNotifications = async () => {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync()
    scheduledNotifications.forEach(notif => {
      console.log(notif.content.title)
    })
  } catch (err) {
    console.log(err)
  }
}

/**
 * useful for testing
 */
export const cancelAllScheduledNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync()
    console.log("notifications cancelled")
  } catch (err) {
    console.log(err)
  }
}

export const checkNeedSchedulingNotifications = async (
  items: CarouselItem[]
) => {
  try {
    const currentScheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync()

    //for each carousel item check if notification was already scheduled
    for (const item of items) {
      let found = false
      console.log(item.title)
      for (let i = 0; i < currentScheduledNotifications.length && !found; i++) {
        if (item.id === currentScheduledNotifications[i].content.data.eventId) {
          console.log("match")
          console.log(item.id)
          found = true
        }
      }
      if (!found) {
        //allow only DEADLINE and EXAMS notifications (?) and if event isn't in the past
        if (
          (item.type === WidgetType.DEADLINE ||
            item.type === WidgetType.EXAMS) &&
          new Date(item.time).getTime() > Date.now()
        ) {
          await sendScheduledNotification(
            {
              title: item.title,
              body: `l'evento si svolgerà ${item.date}`,
              data: { eventId: item.id },
            },
            {
              date: new Date(
                new Date(item.date).getTime() - MINUTES_BEFORE_EVENT * 60 * 1000
              ),
            }
          )
        }
      }
    }
  } catch (e) {
    console.warn(e)
  }
}

export const InitializeNotificationAppCentre = () => {
  inizializeNotificationHandler()

  /* setBackgroundTaskOnNotifications() */

  void setNotificationsChannels()

  void setNotificationCategories()
}

//DEEP LINKING
// ? use more appropriate names
export const linking: LinkingOptions<RootStackNavigatorParams> = {
  config: {
    screens: {
      MainNav: {
        path: "/main_nav",
        screens: {
          Home: "/home",
          Article: "/article",
          OtherCategories: "/other",
          ArticlesList: "/articlelist",
          Error404: "/error",
          Groups: "/groups",
        },
      },
      SettingsNav: {
        path: "/settings_nav",
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

// ! this needs testing both on android and IOS
// ? this could improve
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

/**
 * used for testing permission
 */
export const logPermission = async () => {
  const settings = await Notifications.getPermissionsAsync()
  console.log(settings.android)
  console.log(settings.ios)
  console.log(settings.granted)
}
