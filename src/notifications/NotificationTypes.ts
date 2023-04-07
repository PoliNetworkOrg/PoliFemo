import * as Notifications from "expo-notifications"
import {
  NotificationContent,
  NotificationContentInput,
  Subscription,
} from "expo-notifications"

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
export type NotificationStorage = {
  /**
   * true if User checked the notification as seen in the Notifications Page (?)
   */
  isRead: boolean
  /**
   * true if notification was received at the right time,
   * false: for example phone was turned off (?)
   */
  hasBeenReceived: boolean
  /**
   * a string representing the date at which the notification is scheduled to
   * appear. undefined if notification wasn't scheduled by the device.
   */
  isRelevantAt?: string

  /**
   * keep track of notifications that were scheduled and then removed from schedule
   * before they received
   */
  isDumped?: boolean
} & NotificationInfo

// Extend NotificationContentInput to explicitly define interesting props in the data field.
export interface NotificationCustomContentInput
  extends NotificationContentInput {
  //TODO : define all useful fields
  data: {
    sender?: string
    /**
     * a link which can be tapped by the user and open the browser
     */
    linkUrl?: string
    content?: string
    object?: string
    channelId?: ValidChannelId
    association?: string
    /**
     * if true or undefined, notification is stored in the storage on schedule
     * (most common behaviour),
     * if it is false, it is stored when it is received.
     */
    storeOnSchedule?: boolean
    /**
     * enable deeplinking to NotificationDetails
     */
    deepLink?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}

export type ValidChannelId = "associazioni" | "upload" | "comunicazioni"

// Extend NotificationContent
// through type because NotificationContent doesnt have statically known members
type NotificationCustomContentInputResponse = NotificationContent &
  NotificationCustomContentInput

export interface NotificationCustomRequest
  extends Notifications.NotificationRequest {
  content: NotificationCustomContentInputResponse
}

//Custom Notification Interface used in addNotificationReceivedListener
export interface NotificationCustom extends Notifications.Notification {
  request: NotificationCustomRequest
}

export interface NotificationCustomResponse
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
  export function setNotificationChannelAsync(
    channelId: ValidChannelId,
    channel: Notifications.NotificationChannelInput
  ): Promise<Notifications.NotificationChannel | null>
  export function getAllScheduledNotificationsAsync(): Promise<
    NotificationCustomRequest[]
  >
}

export type NotificationsChannels = Record<ValidChannelId, boolean>
