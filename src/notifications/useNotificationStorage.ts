import { CompositeNavigationProp } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import {
  MainStackNavigatorParams,
  RootStackNavigatorParams,
} from "navigation/NavigationTypes"
import { useState, useEffect } from "react"
import { notificationEventEmitter } from "./NotificationEventEmitter"
import { NotificationCenter } from "./NotificationCenter"
import { NotificationStorage, ValidChannelId } from "./NotificationTypes"
import { logger_debug } from "utils/log/logger"

const notificationCenter = NotificationCenter.getInstance()

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
): [NotificationStorage[]] {
  const [notifications, setNotifications] = useState<NotificationStorage[]>([])

  useEffect(() => {
    function loadNotifications() {
      logger_debug("loading notifications " + channelId)
      const notifications =
        notificationCenter.getNotificationsOfCategory(channelId)
      setNotifications(notifications)
    }

    //if navigation prop is not set load on first render
    if (!navigation) {
      void loadNotifications()
    }

    //load on every focus, also on navigation.goBack fired from next page.
    navigation?.addListener("focus", loadNotifications)

    //load when item is removed
    const listenerRemove = notificationEventEmitter.addListener(
      "notification-remove",
      loadNotifications
    )

    //load when item is added
    const listenerAdd = notificationEventEmitter.addListener(
      "notification-add",
      loadNotifications
    )

    return () => {
      navigation?.removeListener("focus", loadNotifications)
      listenerRemove.remove()
      listenerAdd.remove()
    }
  }, [])

  return [notifications]
}
