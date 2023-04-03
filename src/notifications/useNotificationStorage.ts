import { CompositeNavigationProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import {
  MainStackNavigatorParams,
  RootStackNavigatorParams,
} from "navigation/NavigationTypes"
import { useState, useEffect } from "react"
import { notificationEventEmitter } from "./NotificationEventEmitter"
import { NotificationCentre } from "./NotificationCentre"
import { NotificationStorage, ValidChannelId } from "."

const notificationCentre = NotificationCentre.getInstance()

export function useNotificationStorage(
  channelId?: ValidChannelId,
  navigation?: CompositeNavigationProp<
    StackNavigationProp<
      MainStackNavigatorParams,
      "NotificationsCategory",
      undefined
    >,
    StackNavigationProp<
      RootStackNavigatorParams,
      keyof RootStackNavigatorParams,
      undefined
    >
  >
): [NotificationStorage[], (notifications: NotificationStorage[]) => void] {
  const [notifications, setNotifications] = useState<NotificationStorage[]>([])

  useEffect(() => {
    function loadNotifications() {
      console.log("loading notifications")
      const notifications =
        notificationCentre.getNotificationsOfCategory(channelId)
      setNotifications(notifications)
    }

    //if navigation prop is not set load on first render
    if (!navigation) {
      void loadNotifications()
    }

    //load on every focus, also on navigation.goBack fired from next page.
    navigation?.addListener("focus", loadNotifications)

    //load when item is removed
    const listener = notificationEventEmitter.addListener(
      "notification-remove",
      loadNotifications
    )

    return () => {
      navigation?.removeListener("focus", loadNotifications)
      listener.remove()
    }
  }, [])

  return [notifications, notifications => setNotifications(notifications)]
}
