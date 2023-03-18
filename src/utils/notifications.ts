/* eslint-disable @typescript-eslint/naming-convention */
import { Subscription } from "expo-clipboard"
import * as Notifications from "expo-notifications"
import {
  AndroidImportance,
  NotificationContent,
  NotificationContentInput,
  NotificationTriggerInput,
} from "expo-notifications"
import { useEffect, useRef } from "react"
import { CarouselItem, WidgetType } from "./carousel"
import { LinkingOptions } from "@react-navigation/native"
import { RootStackNavigatorParams } from "navigation/NavigationTypes"
import { Linking } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface ScheduledNotificationInfo {
  eventId: number
  identifier: string
}

export interface NotificationInfo {
  identifier: string
  content: NotificationCustomContentInput
}

/**
 * interface for notifications stored in the AsyncStorage
 */
export interface NotificationStorage {
  notification: NotificationInfo
  /**
   * true if User checked the notification as seen in the Notifications Page (?)
   */
  isRead: boolean
  /**
   * true if notification was received at the right time,
   * false: for example phone was turned off (?)
   */
  hasBeenReceived?: boolean
  /**
   * a string representing the date at which the notification is scheduled to
   * appear. undefined if notification wasn't scheduled by the device.
   */
  isRelevantAt?: string
}

// Extend NotificationContentInput to explicitly define interesting props in the data field.
interface NotificationCustomContentInput extends NotificationContentInput {
  data: {
    sender?: string
    linkUrl?: string
    content?: string
    object?: string
    categoryId?: ValidCategoryId
    association?: string
    cacheOnSchedule?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}

// Extend NotificationContent
// through type because NotificationContent doesnt have statically known members
type NotificationCustomContentInputResponse = NotificationContent &
  NotificationCustomContentInput

export type ValidCategoryId = "associazioni" | "upload" | "comunicazioni"

interface NotificationCustomRequest extends Notifications.NotificationRequest {
  content: NotificationCustomContentInputResponse
}

//Custom Notification Interface used in addNotificationReceivedListener
interface NotificationCustom extends Notifications.Notification {
  request: NotificationCustomRequest
}

interface NotificationCustomResponse
  extends Notifications.NotificationResponse {
  notification: NotificationCustom
}

declare module "expo-notifications" {
  export function addNotificationReceivedListener(
    listener: (event: NotificationCustom) => void
  ): Subscription
  export function addNotificationResponseReceivedListener(
    listener: (event: NotificationCustomResponse) => void
  ): Subscription
}

/**
 * If events starts at 14:00, send notification at 13:30
 */
const MINUTES_BEFORE_EVENT = 30
const DELTA_MILLISECONDS = MINUTES_BEFORE_EVENT * 60 * 1000

export const inizializeNotificationHandler = () =>
  Notifications.setNotificationHandler({
    // eslint-disable-next-line @typescript-eslint/require-await
    handleNotification: async () => {
      return {
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }
    },
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
  content: NotificationCustomContentInput,
  trigger: NotificationTriggerInput
) => {
  try {
    console.log("scheduling starting...")
    const grant = await checkPermission()
    console.log("grant: " + grant)
    if (grant) {
      const cacheOnSchedule = content.data.cacheOnSchedule ?? true

      content.data.cacheOnSchedule = cacheOnSchedule

      const identifier = await Notifications.scheduleNotificationAsync({
        content: content,
        trigger: trigger,
      })

      console.log("scheduled notification of identifier: " + identifier)

      let relevantDate: Date | undefined
      if (cacheOnSchedule) {
        relevantDate = calculateDateFromTrigger(trigger)

        await setNotificationInStorage({ content, identifier }, relevantDate)
        console.log("notification set in storage: " + identifier)
      }

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
      Notifications.addNotificationReceivedListener(async notification => {
        console.log(
          "received notification request " + notification.request.content.title
        )

        if (!notification.request.content.data.cacheOnSchedule) {
          console.log("saving in storage from handler")
          const notificationList = await getAllNotificationsFromStorage()
          if (notificationList) {
            notificationList.push({
              notification: {
                content: notification.request.content,
                identifier: notification.request.identifier,
              },
              isRead: false,
              hasBeenReceived: true,
            })
            await setNotificationsListInStorage(notificationList)
          }
        }
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

export const popNotificationFromStorage = async (identifier: string) => {
  try {
    const notificationsJSON = await AsyncStorage.getItem("notifications")

    let updatedList: NotificationStorage[] = []
    if (notificationsJSON) {
      updatedList = JSON.parse(notificationsJSON) as NotificationStorage[]
    }

    let found = false
    for (let i = 0; i < updatedList.length && !found; i++) {
      if (updatedList[i].notification.identifier === identifier) {
        updatedList.splice(i, 1)
        found = true
      }
    }

    await AsyncStorage.setItem("notifications", JSON.stringify(updatedList))
  } catch (err) {
    console.log(err)
  }
}

export const getAllNotificationsFromStorage = async () => {
  try {
    const notificationsJSON = await AsyncStorage.getItem("notifications")
    if (notificationsJSON) {
      const notificationsList = JSON.parse(
        notificationsJSON
      ) as NotificationStorage[]

      return notificationsList
    } else {
      return []
    }
  } catch (err) {
    console.log(err)
  }

  return []
}

export const setNotificationAsReadStorage = async (identifier: string) => {
  const notifications = await getAllNotificationsFromStorage()
  let found = false
  for (let i = 0; i < notifications.length && !found; i++) {
    if (notifications[i].notification.identifier === identifier) {
      notifications[i].isRead = true
      found = true
    }
  }
  await setNotificationsListInStorage(notifications)
}

/**
 * Function to set notifications list in AsyncStorage
 * @return true if successful, false otherwise
 */
export const setNotificationsListInStorage = async (
  notification: NotificationStorage[]
) => {
  try {
    await AsyncStorage.setItem("notifications", JSON.stringify(notification))
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export const setNotificationInStorage = async (
  notification: NotificationInfo,
  date: Date | undefined
) => {
  try {
    const notifications = await getAllNotificationsFromStorage()

    notifications?.push({
      notification: notification,
      isRead: false,
      hasBeenReceived: false,
      isRelevantAt: date?.toISOString() ?? new Date().toISOString(),
    })

    await AsyncStorage.setItem("notifications", JSON.stringify(notifications))
    console.log("notification set in storage completed.")
  } catch (err) {
    console.log(err)
  }
}

export const getAllNotificationsOfCategory = async (
  categoryId: ValidCategoryId
) => {
  const notificationList = await getAllNotificationsFromStorage()

  const categoryList: NotificationStorage[] = []
  for (let i = 0; i < notificationList.length; i++) {
    const date = notificationList[i].isRelevantAt
    if (
      notificationList[i].notification.content.data.categoryId === categoryId &&
      ((date && new Date(date).getTime() < new Date().getTime()) || !date)
    ) {
      categoryList.push(notificationList[i])
    }
  }
  return categoryList
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
                data: { eventId: item.id, categoryId: "comunicazioni" },
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
  try {
    const settings = await Notifications.getPermissionsAsync()
    if (
      settings.granted ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    ) {
      return true
    } else if (
      settings.status === "undetermined" ||
      settings.ios?.status ===
        Notifications.IosAuthorizationStatus.NOT_DETERMINED
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
  } catch (err) {
    console.log("problem in requesting permissions")
    console.log(err)
    return false
  }
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
    console.log("permission is granted: " + settings.granted)
  },

  async askPermission() {
    try {
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
    } catch (err) {
      console.log("problem in requesting permissions")
      return false
    }
  },

  async logAllScheduledNotifications() {
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
  async logAllPresentedNotifications() {
    try {
      const scheduledNotifications =
        await Notifications.getPresentedNotificationsAsync()
      scheduledNotifications.forEach(notif => {
        console.log(notif.request.content.title)
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

//User defined typeguard to check trigger input. Only check relevant info
interface MyDateTriggerInterface {
  date: Date | number
}

function isDateTriggerInput(input: unknown): input is MyDateTriggerInterface {
  return (
    typeof input === "object" &&
    input !== null &&
    "date" in input &&
    (typeof input.date === "number" || input.date instanceof Date)
  )
}

function isTimeIntervalTriggerInput(
  input: unknown
): input is { seconds: number } {
  return (
    typeof input === "object" &&
    input !== null &&
    "seconds" in input &&
    typeof input.seconds === "number"
  )
}

function isWeeklyTriggerInput(
  input: unknown
): input is { weekday: number; hour: number; minute: number } {
  return (
    typeof input === "object" &&
    input !== null &&
    "weekday" in input &&
    typeof input.weekday === "number" &&
    "hour" in input &&
    typeof input.hour === "number" &&
    "minute" in input &&
    typeof input.minute === "number"
  )
}

function isDailyTriggerInput(
  input: unknown
): input is { hour: number; minute: number } {
  return (
    typeof input === "object" &&
    input !== null &&
    "hour" in input &&
    "minute" in input &&
    typeof input.minute === "number" &&
    typeof input.hour === "number"
  )
}

const calculateDateFromTrigger = (trigger: NotificationTriggerInput) => {
  let relevantDate: Date | undefined
  if (trigger instanceof Date) {
    relevantDate = trigger
  } else if (typeof trigger === "number") {
    relevantDate = new Date(trigger)
  } else if (isDateTriggerInput(trigger)) {
    if (typeof trigger.date === "number") {
      relevantDate = new Date(trigger.date)
    } else {
      relevantDate = trigger.date
    }
  } else if (isTimeIntervalTriggerInput(trigger)) {
    relevantDate = new Date(new Date().getTime() + trigger.seconds * 1000)
  } else if (isDailyTriggerInput(trigger)) {
    relevantDate = new Date(
      new Date().getTime() +
        trigger.minute * 60 * 1000 +
        trigger.hour * 60 * 60 * 1000
    )
  } else if (isWeeklyTriggerInput(trigger)) {
    const weekDay = trigger.weekday
    const nowDay = new Date().getDay()
    let dayDifference = weekDay - nowDay
    if (dayDifference < 0) {
      dayDifference += 7
    }
    relevantDate = new Date(
      new Date().getTime() +
        trigger.minute * 60 * 1000 +
        trigger.hour * 60 * 60 * 1000 +
        dayDifference * 24 * 60 * 60 * 1000
    )
  }
  return relevantDate
}
