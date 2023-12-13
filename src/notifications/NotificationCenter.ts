import {
  MinutesBeforeOptions,
  calculateDateFromTrigger,
  getContentMessageFromType,
  getMinutesBeforeInMilliseconds,
  getObjectMessageFromType,
  mapNotificationChannelString,
} from "utils/notifications"
import * as FileSystem from "expo-file-system"
import * as Notifications from "expo-notifications"
import { AndroidImportance, NotificationTriggerInput } from "expo-notifications"
import { CarouselItem } from "utils/carousel"
import { EventType } from "utils/events"
import {
  NotificationStorage,
  NotificationCustomContentInput,
  ValidChannelId,
  NotificationsChannels,
} from "./NotificationTypes"
import { notificationEventEmitter } from "./NotificationEventEmitter"
import { navigationRef } from "navigation/NavigationTypes"
import uuid from "react-native-uuid"

export class NotificationCenter {
  private static classInstance?: NotificationCenter

  private _notifications: NotificationStorage[] = []

  /**
   * Channels which accept scheduling. All true by default
   */
  private _activeChannels: NotificationsChannels = {
    associazioni: true,
    comunicazioni: true,
    upload: true,
  }

  public activeChannels = () => {
    return this._activeChannels
  }

  /**
   * retrieves singleton instance.
   * */
  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new NotificationCenter()
    }

    return this.classInstance
  }

  private constructor() {
    this._initializeNotificationCenter()
  }

  //a not-so-useful function which groups all initializers
  private _initializeNotificationCenter = () => {
    this._inizializeNotificationHandler()
    void this._setNotificationsChannels()
    this._initializeNotificationListeners()
    //read from storage on app start
    void this._readFromStorage()
    //check permission on app start
    void this._checkPermission()
    //initialize active notifications channels
    void this._readChannelsFromStorage()
  }

  /**
   * This is intended to be called on app start. Without this, notifications
   * won't be shown in the status bar while the app is running.
   */
  private _inizializeNotificationHandler = () =>
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

  /**
   * This method initializes notfication channels, which are useful for setting importance
   * and notification behaviour. Seems to be android specific.
   * It seems good practice to have these, otherwise a default "Miscellaneous" channel
   * is created.
   *
   */
  private _setNotificationsChannels = async () => {
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
        importance: AndroidImportance.MAX,
      })
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * This method initializes the notifications listeners.
   *
   * `Notifications.addNotificationReceivedListener` is fired when the notification
   *  pops up in the status bar
   *
   * `Notifications.addNotificationResponseReceivedListener` is fired when the notification
   *  is tapped by the user
   */
  private _initializeNotificationListeners = () => {
    Notifications.addNotificationReceivedListener(notification => {
      console.log(
        "received notification: " + notification.request.content.title
      )
      //if storeOnSchedule is set to false, store now. (more intended for push notifications...)
      //by default storeOnSchedule is true for every notification scheduled by the device
      // TODO : might need changing if push notifications will be implemented
      if (notification.request.content.data.storeOnSchedule === false) {
        console.log("Notification received with storeOnSchedule set to false")
        const newNotificationList = this._notifications
        if (newNotificationList) {
          newNotificationList.push({
            content: notification.request.content,
            identifier: notification.request.identifier,
            isRead: false,
            hasBeenReceived: true,
          })
          //store now
          void this._writeToStorage(newNotificationList)
        }
      } else {
        //already stored
        this._markAsReceived(notification.request.identifier)
      }
      notificationEventEmitter.emit("badge-change")
      notificationEventEmitter.emit("notification-add")
    })
    Notifications.addNotificationResponseReceivedListener(response => {
      //by default this always evaluates to true, therefore always dismissed
      if (
        !response.notification.request.content.data.overrideDismissBehaviour
      ) {
        void Notifications.dismissNotificationAsync(
          response.notification.request.identifier
        )
      }

      //deepLinking
      const isDeepLink = response.notification.request.content.data.deepLink

      if (isDeepLink && response.notification) {
        navigationRef.current?.navigate("MainNav", {
          screen: "NotificationDetails",
          params: {
            notification: {
              content: response.notification.request.content,
              hasBeenReceived: true,
              identifier: response.notification.request.identifier,
              isRead: true,
              isRelevantAt: undefined,
            },
            category: mapNotificationChannelString(
              response.notification.request.content.data.channelId
            ),
          },
        })
        this.markAsRead(response.notification.request.identifier)
      }
    })
  }
  /**
   * This is a private method which reads notifications from Storage and update
   * the notifications member of the singleton.
   *
   * This method is intended to be called on App start.
   */
  private _readFromStorage = async () => {
    try {
      const notificationsJSON = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + "notifications.json"
      )
      const notifications = JSON.parse(
        notificationsJSON
      ) as NotificationStorage[]
      this._notifications = notifications
    } catch (err) {
      console.log(err)
      console.log("Error reading notifications")
      this._notifications = []
    }
  }

  /**
   * This is a private method which updates notifications inside the storage
   * and updates the notifications member inside the singleton, so that we
   * read from storage only once: on app start.
   *
   */
  private _writeToStorage = async (
    notifications: NotificationStorage[]
  ): Promise<boolean> => {
    const notificationsJSON = JSON.stringify(notifications)
    try {
      this._notifications = notifications
      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + "notifications.json",
        notificationsJSON
      )

      return true
    } catch (err) {
      console.log(err)
      console.log("Error storing notifications")
      return false
    }
  }

  /**
   * This is a private method which reads notifications channels from Storage and update
   * the notifications member of the singleton.
   */
  private _readChannelsFromStorage = async () => {
    try {
      const notificationsChannelsJSON = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + "notifications-channels.json"
      )
      const notificationsChannels = JSON.parse(
        notificationsChannelsJSON
      ) as NotificationsChannels

      this._activeChannels = notificationsChannels
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * This is a private method which updates channels inside the storage
   * and updates the active channels member inside the singleton
   *
   */
  private _writeChannelsToStorage = async (
    channels: NotificationsChannels
  ): Promise<boolean> => {
    const notificationsChannelsJSON = JSON.stringify(channels)
    try {
      this._activeChannels = channels
      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + "notifications-channels.json",
        notificationsChannelsJSON
      )

      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  /**
   * This is a private method which adds one notification inside the
   * notifications member and writes to storage the newly updated list.
   *
   * @param notification notification to be added
   */
  private _addOneNotification = (notification: NotificationStorage) => {
    const newNotificationList = this._notifications
    newNotificationList.push(notification)
    this._notifications = newNotificationList
    void this._writeToStorage(newNotificationList)
  }

  /**
   * Schedule a notification. Usage:
   *
   * ```ts
   * void NotificationCenter.sendScheduledNotification(
   *        {
   *          title: "Notifica SCACCHI",
   *          body: "prova",
   *          data: {
   *            sender: "polimi scacchi",
   *            storeOnSchedule: false,
   *            content: "vieni a giocare a scacchi",
   *            object: "come vincere a scacchi",
   *            linkUrl:
   *              "https://url_di_una_immagine_da_mostrare_ad_esempio",
   *            deepLink: true
   *          },
   *        },
   *        {
   *          date: new Date(new Date().getTime() + 2000),
   *        },
   *        "associazioni"
   *      )
   * ```
   * @param content content object
   * @param trigger trigger object, can be date or null (send immediately)
   * @param channelId override content channelId and trigger channelId, for practicality
   * @param oldIdentifier force the notification identifier, intended for rescheduling dumped notifications
   * @param alllowSchedulingInThePast don't schedule if trigger date is in the past, intended for improving
   * dumped notifications reschedule behaviour
   * @returns the identifier of the notification
   */
  public sendScheduledNotification = async (
    content: NotificationCustomContentInput,
    trigger: NotificationTriggerInput,
    channelId?: ValidChannelId,
    oldIdentifier?: string,
    allowSchedulingInThePast = true
  ) => {
    try {
      const grant = await this._checkPermission()

      if (!allowSchedulingInThePast) {
        const relevantDate: Date | undefined = calculateDateFromTrigger(trigger)
        //don't allow scheduling in the past
        if (
          relevantDate &&
          new Date(relevantDate).getTime() - new Date().getTime() < 0
        ) {
          return undefined
        }
      }

      //permission granted
      if (grant) {
        if (!content.data) {
          content.data = {}
        }
        //unify content's channelId with trigger channelId
        content.data.channelId = content.data?.channelId ?? channelId
        if (
          trigger !== null &&
          typeof trigger === "object" &&
          !(trigger instanceof Date)
        ) {
          trigger.channelId = channelId
        }
        // mark storeOnSchedule as true by default
        const storeOnSchedule = content.data.storeOnSchedule ?? true
        content.data.storeOnSchedule = storeOnSchedule

        let identifier: string | undefined

        const isChannelActive = this._isChannelActive(content.data.channelId)

        //schedule only if channel is active
        if (isChannelActive) {
          identifier = await Notifications.scheduleNotificationAsync({
            content: content,
            trigger: trigger,
            identifier: oldIdentifier,
          })
          console.log("scheduled notification of identifier: " + identifier)
        }
        if (!identifier) {
          identifier = uuid.v4().toString()
        }
        //store if: storeOnSchedule wasn't set to false,
        //oldIdentifier is not set, meaning we're not rescheduling a dumped notif.
        if (storeOnSchedule && !oldIdentifier) {
          //store notification in filesystem
          const relevantDate: Date | undefined =
            calculateDateFromTrigger(trigger)

          const isRelevantAt =
            relevantDate?.toISOString() ?? new Date().toISOString()

          this._addOneNotification({
            content,
            identifier,
            isRead: false,
            hasBeenReceived: false,
            isRelevantAt: isRelevantAt,
          })
        }
        notificationEventEmitter.emit("badge-change")

        return identifier
      }
    } catch (err) {
      //something went wrong (?)
      console.log(err)
      return undefined
    }
  }

  private _checkPermission = async () => {
    try {
      const settings = await Notifications.getPermissionsAsync()
      if (
        settings.granted ||
        settings.ios?.status ===
          Notifications.IosAuthorizationStatus.PROVISIONAL
      ) {
        return true
      } else if (
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

  /**
   * This method marks as received a notification and updates the storage.
   * @param identifier identifies a notification uniquely
   */
  private _markAsReceived = (identifier: string) => {
    for (let i = 0; i < this._notifications.length; i++) {
      if (this._notifications[i].identifier === identifier) {
        this._notifications[i].hasBeenReceived = true
      }
    }
    void this._writeToStorage(this._notifications)
  }

  //TODO : implement markAsRead in deep linking, on user notification tap.
  /**
   * This method marks as received a notification and updates the storage.
   * @param identifier identifies a notification uniquely
   */
  public markAsRead = (identifier: string) => {
    let found = false
    for (let i = 0; i < this._notifications.length && !found; i++) {
      if (this._notifications[i].identifier === identifier) {
        this._notifications[i].isRead = true
        found = true
      }
    }
    if (found) {
      notificationEventEmitter.emit("badge-change")
      void this._writeToStorage(this._notifications)
    }
  }

  /**
   * Removes notification from storage, updates notifications singleton member.
   * @param identifier notification identifier
   */
  public removeNotificationFromStorage = (identifier: string) => {
    for (let i = 0; i < this._notifications.length; i++) {
      if (this._notifications[i].identifier === identifier) {
        //remove from storage
        this._notifications.splice(i, 1)
        void this._writeToStorage(this._notifications)
        //emit events
        notificationEventEmitter.emit("notification-remove")
        notificationEventEmitter.emit("badge-change")
      }
    }
  }

  //TODO : Define notification styling and behaviour for every type: Exams, deadlines, lectures...
  /**
   * This method checks if some events inside the carousel needs scheduling, and
   * if so schedule them.
   *
   * @param items carousel items
   * @param minutesBefore set when to receive notification
   */
  public scheduleCarousel = async (
    items: CarouselItem[],
    minutesBefore?: MinutesBeforeOptions
  ) => {
    try {
      const isGrant = await this._checkPermission()

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
            if (
              (item.type === EventType.DEADLINE ||
                item.type === EventType.EXAMS) &&
              item.dateStart.getTime() - deltaMilliseconds > Date.now()
            ) {
              const contentMessage = getContentMessageFromType(
                item.type,
                item.date,
                item.time
              )

              await this.sendScheduledNotification(
                {
                  title: item.title,
                  body: contentMessage,
                  data: {
                    //eventId let us know which notifications have already been scheduled
                    eventId: item.id,
                    channelId: "comunicazioni",
                    content: contentMessage,
                    object: getObjectMessageFromType(item.type),
                    sender: "Centro Notifiche",
                  },
                },
                {
                  date: new Date(item.dateStart.getTime() - deltaMilliseconds),
                  channelId: "comunicazioni",
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

  /**
   * Method for counting the number of unread notifications.
   *
   * @param channelId  get only notification unread count of given channel.
   * @returns number of unread notifications, undefined if zero.
   */
  public getBadgeAllUnreadNotifications = (channelId?: ValidChannelId) => {
    const notifications = this._notifications
    let count = 0
    for (let i = 0; i < notifications?.length; i++) {
      const isRelevantAt = notifications[i].isRelevantAt
      const isRead = notifications[i].isRead
      //increment if not read and (relevantDate is before now or relevant date was not set) and
      // channelId was not specified or if it was, it's matching
      if (
        !isRead &&
        (!isRelevantAt ||
          new Date(isRelevantAt).getTime() < new Date().getTime()) &&
        (!channelId ||
          (channelId && channelId === notifications[i].content.data?.channelId))
      ) {
        count++
      }
    }
    if (count === 0) {
      return undefined
    }
    return count
  }

  /**
   * This method returns the notifications which are relevant and of the given category,
   * if the category is not set, it returns all the relevant notifications.
   *
   * @param channelId
   *
   */
  public getNotificationsOfCategory(channelId?: ValidChannelId) {
    const notifications = this._notifications
    const now = new Date()

    if (!channelId) {
      return notifications.filter(notification => {
        const isRelevantAt = notification.isRelevantAt
        return !isRelevantAt || new Date(isRelevantAt).getTime() < now.getTime()
      })
    }
    const notificationsOfCategory = []

    for (let i = 0; i < notifications?.length; i++) {
      const isRelevantAt = notifications[i].isRelevantAt
      if (
        notifications[i].content.data?.channelId === channelId &&
        (!isRelevantAt || new Date(isRelevantAt).getTime() < now.getTime())
      ) {
        notificationsOfCategory.push(notifications[i])
      }
    }

    return notificationsOfCategory
  }

  /**
   * Update notification channels when user switch notification categories on and off
   * @param channels new activeChannels
   *
   * This method only dumps and undumps notifications whose channelId is set
   */

  public updateNotificationsChannels = (
    channels: NotificationsChannels,
    switchVal: boolean
  ) => {
    this._activeChannels = channels
    void this._writeChannelsToStorage(this._activeChannels)

    if (!switchVal) {
      void this._dumpScheduledNotifications()
    } else {
      void this._unDumpScheduledNotifications()
    }
  }

  /**
   * This method is for checking if a channel is active
   *
   * @param channel
   */
  private _isChannelActive = (channel?: ValidChannelId) => {
    if (!channel) {
      //channel wasn't set, or all channels are active
      return true
    }
    if (this._activeChannels[channel]) {
      return true
    }
    return false
  }

  /**
   * When user switches off a notification category this method is responsible
   * for cancelling all scheduled notifications of that category from the phone scheduler.
   *
   * When dumped notifications will be become relevant they will still appear in their
   * respective category.
   *
   */
  private _dumpScheduledNotifications = async () => {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync()

      const dumpedNotificationsIdentifiers: string[] = []

      for (let i = 0; i < scheduledNotifications.length; i++) {
        if (
          !this._isChannelActive(
            scheduledNotifications[i].content.data.channelId
          )
        ) {
          //remove from schedule
          await Notifications.cancelScheduledNotificationAsync(
            scheduledNotifications[i].identifier
          )

          dumpedNotificationsIdentifiers.push(
            scheduledNotifications[i].identifier
          )
        }
      }

      this._markNotificationsStorageAsDumped(dumpedNotificationsIdentifiers)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Mark storage notifications as dumped if they were removed from schedule.
   *
   * @param identifiers
   */
  private _markNotificationsStorageAsDumped = (identifiers: string[]) => {
    let hasArrayChanged = false
    this._notifications.forEach((notification, index, array) => {
      if (identifiers.includes(notification.identifier)) {
        array[index].isDumped = true
        hasArrayChanged = true
      }
    })
    if (hasArrayChanged) {
      void this._writeToStorage(this._notifications)
    }
  }

  /**
   * This method checks if dumped notifications belong to a newly activated channel and
   * tries to reschedule them.
   *
   * This method will reschedule only if the trigger date is in the future
   */
  private _unDumpScheduledNotifications = async () => {
    try {
      const restoredNotificationIdentifiers: string[] = []

      for (let i = 0; i < this._notifications.length; i++) {
        if (
          this._notifications[i].isDumped &&
          this._isChannelActive(this._notifications[i].content.data?.channelId)
        ) {
          const isDeviceScheduled =
            this._notifications[i].content.data?.storeOnSchedule
          const scheduleDateISO = this._notifications[i].isRelevantAt
          const channelId = this._notifications[i].content.data?.channelId

          //notification was scheduled by the device and has a relevant date
          if (isDeviceScheduled && scheduleDateISO && channelId) {
            //don't allow for scheduling in the past
            const identifier = await this.sendScheduledNotification(
              this._notifications[i].content,
              {
                date: new Date(scheduleDateISO),
              },
              channelId,
              this._notifications[i].identifier,
              false
            )
            if (identifier) {
              //scheduling was successful
              restoredNotificationIdentifiers.push(identifier)
            }
          }
        }
      }

      this._restoreDumpedNotificationsStorage(restoredNotificationIdentifiers)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * This method updates notification member by changing isDumped value to false
   * to restored notifications
   *
   * @param identifiers list of identifiers of rescheduled notifications
   */
  private _restoreDumpedNotificationsStorage = (identifiers: string[]) => {
    let hasArrayChanged = false
    this._notifications.forEach((notification, index, array) => {
      if (identifiers.includes(notification.identifier)) {
        array[index].isDumped = false
        hasArrayChanged = true
      }
    })
    if (hasArrayChanged) {
      void this._writeToStorage(this._notifications)
    }
  }
}
