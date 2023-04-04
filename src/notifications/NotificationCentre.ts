import {
  MinutesBeforeOptions,
  calculateDateFromTrigger,
  getMinutesBeforeInMilliseconds,
} from "utils/notifications"
import * as FileSystem from "expo-file-system"
import * as Notifications from "expo-notifications"
import { AndroidImportance, NotificationTriggerInput } from "expo-notifications"
import { CarouselItem, WidgetType } from "utils/carousel"
import {
  NotificationStorage,
  NotificationCustomContentInput,
  ValidChannelId,
} from "."
import { notificationEventEmitter } from "./NotificationEventEmitter"

export class NotificationCentre {
  private static classInstance?: NotificationCentre

  public notifications: NotificationStorage[] = []

  private notificationReceivedListener: Notifications.Subscription | undefined
  private notificationTappedListener: Notifications.Subscription | undefined

  /**
   * retrieves singleton instance.
   * */
  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new NotificationCentre()
    }

    return this.classInstance
  }

  private constructor() {
    this._initializeNotificationCentre()
  }

  //a not-so-useful function which groups all initializers
  private _initializeNotificationCentre = () => {
    this._inizializeNotificationHandler()
    void this._setNotificationsChannels()
    this._initializeNotificationListeners()
    //read from storage on app start
    void this._readFromStorage()
    //check permission on app start
    void this._checkPermission()
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
    this.notificationReceivedListener =
      Notifications.addNotificationReceivedListener(notification => {
        console.log(notification.request.content.title)
        //if cacheOnSchedule is set to false, cache now. (more intended for push notifications...)
        //by default cacheOnSchedule is true for every notification scheduled by the device
        // TODO : might need changing if push notifications will be implemented
        if (notification.request.content.data.cacheOnSchedule === false) {
          console.log("Notification received with cacheOnSchedule set to false")
          const newNotificationList = this.notifications
          if (newNotificationList) {
            newNotificationList.push({
              content: notification.request.content,
              identifier: notification.request.identifier,
              isRead: false,
              hasBeenReceived: true,
            })
            void this._writeToStorage(newNotificationList)
          }
        } else {
          this._markAsReceived(notification.request.identifier)
        }
        notificationEventEmitter.emit("badge-change")
        notificationEventEmitter.emit("notification-add")
      })
    this.notificationTappedListener =
      Notifications.addNotificationResponseReceivedListener(response => {
        //by default this always evaluates to true, therefore always dismissed
        if (
          !response.notification.request.content.data.overrideDismissBehaviour
        ) {
          void Notifications.dismissNotificationAsync(
            response.notification.request.identifier
          )
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
      this.notifications = notifications
    } catch (err) {
      console.log(err)
      console.log("Error reading notifications")
      this.notifications = []
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
      this.notifications = notifications
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
   * This is a private method which adds one notification inside the
   * notifications member and writes to storage the newly updated list.
   *
   * @param notification notification to be added
   */
  private _addOneNotification = (notification: NotificationStorage) => {
    const newNotificationList = this.notifications
    newNotificationList.push(notification)
    this.notifications = newNotificationList
    void this._writeToStorage(newNotificationList)
  }

  //TODO : unify data prop channelId with trigger channelId
  /**
   * Schedule a notification. Usage:
   *
   * ```ts
   * void notificationCentre.sendScheduledNotification(
   *        {
   *          title: "Notifica SCACCHI",
   *          body: "prova",
   *          data: {
   *            sender: "polimi scacchi",
   *            cacheOnSchedule: false,
   *            channelId: "associazioni",
   *            content: "vieni a giocare a scacchi",
   *            object: "come vincere a scacchi",
   *            linkUrl:
   *              "https://url",
   *          },
   *        },
   *        {
   *          date: new Date(new Date().getTime() + 2000),
   *          channelId: "associazioni",
   *        }
   *      )
   * ```
   * @param content content object
   * @param trigger trigger object, can be date or null (send immediately)
   * @param channelId override content channelId, for practicality
   * @returns the identifier of the notification
   */
  public sendScheduledNotification = async (
    content: NotificationCustomContentInput,
    trigger: NotificationTriggerInput,
    channelId?: ValidChannelId
  ) => {
    try {
      const grant = await this._checkPermission()
      console.log("grant: " + grant)
      if (grant) {
        //unify
        content.data.channelId = content.data.channelId ?? channelId
        if (
          trigger !== null &&
          typeof trigger === "object" &&
          !(trigger instanceof Date)
        ) {
          trigger.channelId = channelId
        }
        // mark cacheOnSchedule as true by default
        const cacheOnSchedule = content.data.cacheOnSchedule ?? true
        content.data.cacheOnSchedule = cacheOnSchedule

        //schedule notification
        const identifier = await Notifications.scheduleNotificationAsync({
          content: content,
          trigger: trigger,
        })
        console.log("scheduled notification of identifier: " + identifier)

        if (cacheOnSchedule) {
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

  /**
   * This method marks as received a notification and updates the storage.
   * @param identifier identifies a notification uniquely
   */
  private _markAsReceived = (identifier: string) => {
    for (let i = 0; i < this.notifications.length; i++) {
      if (this.notifications[i].identifier === identifier) {
        this.notifications[i].hasBeenReceived = true
      }
    }
    void this._writeToStorage(this.notifications)
  }

  //TODO : implement markAsRead in deep linking, on user notification tap.
  /**
   * This method marks as received a notification and updates the storage.
   * @param identifier identifies a notification uniquely
   */
  public markAsRead = (identifier: string) => {
    let found = false
    for (let i = 0; i < this.notifications.length && !found; i++) {
      if (this.notifications[i].identifier === identifier) {
        this.notifications[i].isRead = true
        found = true
      }
    }
    if (found) {
      notificationEventEmitter.emit("badge-change")
      void this._writeToStorage(this.notifications)
    }
  }

  /**
   * Removes notification from storage, updates notifications singleton member.
   * @param identifier notification identifier
   */
  public removeNotificationFromStorage = (identifier: string) => {
    for (let i = 0; i < this.notifications.length; i++) {
      if (this.notifications[i].identifier === identifier) {
        //remove from storage
        this.notifications.splice(i, 1)
        void this._writeToStorage(this.notifications)
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
              (item.type === WidgetType.DEADLINE ||
                item.type === WidgetType.EXAMS ||
                item.type === WidgetType.LECTURES) &&
              new Date(item.isoDate).getTime() - deltaMilliseconds > Date.now()
            ) {
              await this.sendScheduledNotification(
                {
                  title: item.title,
                  body: `l'evento si svolgerà ${item.date} alle ${item.time}`,
                  data: {
                    //eventId let us know which notifications have already been scheduled
                    eventId: item.id,
                    channelId: "comunicazioni",
                    content: `l'evento si svolgerà ${item.date} alle ${item.time}`,
                    object: "Hai una nuova lezione! Divertiti!",
                  },
                },
                {
                  date: new Date(
                    new Date(item.isoDate).getTime() - deltaMilliseconds
                  ),
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
    const notifications = this.notifications
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
          (channelId && channelId === notifications[i].content.data.channelId))
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
    const notifications = this.notifications
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
        notifications[i].content.data.channelId === channelId &&
        (!isRelevantAt || new Date(isRelevantAt).getTime() < now.getTime())
      ) {
        notificationsOfCategory.push(notifications[i])
      }
    }

    return notificationsOfCategory
  }

  /**
   * this is a cleanup function to remove the listeners. Probably should never be called.
   * So is it really useful for something? lol
   * TODO : understand if this is actually useful
   */
  public cleanup = () => {
    if (this.notificationReceivedListener) {
      Notifications.removeNotificationSubscription(
        this.notificationReceivedListener
      )
    }
    if (this.notificationTappedListener) {
      Notifications.removeNotificationSubscription(
        this.notificationTappedListener
      )
    }
  }
}
