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
 *    data: { data: 'goes here' },
 *  },
 *```

  * @param trigger 
 * you can also specify Date, see {@link SchedulableNotificationTriggerInput}
 * @example
 * ```ts
 *  trigger: {
 *    seconds: 60,
 *    channelId: "COMUNICAZIONI"
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
    const identifier = await Notifications.scheduleNotificationAsync({
      content: content,
      trigger: trigger,
    })
    return identifier
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
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        console.log(
          "received notification request " + notification.request.content.title
        )
        console.log(notification.request.trigger?.type)
        console.log(notification.request.content)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(
          "arrived notification response " +
            response.notification.request.content.title
        )
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

//looks like it's not working. Maybe because of Expo Go?
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
 * Removes all scheduled notifications
 */
export const clearNotifcationCentreTray = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync()
  } catch (err) {
    console.log(err)
  }
}

/**
 *
 * @param id identifier received when notification was scheduled
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

// Android only, not clear what it should do in terms of differences in the message
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

// ! testing
export const setNotificationCategories = async () => {
  await Notifications.setNotificationCategoryAsync("prova", [
    {
      identifier: "identifier",
      buttonTitle: "Uno",
      options: {},
    },
    {
      identifier: "identifier",
      buttonTitle: "Due",
      options: {},
    },
    {
      identifier: "identifier",
      buttonTitle: "Tre",
      options: {},
    },
  ])
}

export const InitializeNotificationAppCentre = () => {
  inizializeNotificationHandler()

  setBackgroundTaskOnNotifications()

  void setNotificationsChannels()

  void setNotificationCategories()
}
