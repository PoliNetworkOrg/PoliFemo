import { NotificationCenter } from "./NotificationCenter"
import { useState, useEffect } from "react"
import { notificationEventEmitter } from "./NotificationEventEmitter"
import { ValidChannelId } from "./NotificationTypes"

const notificationCenter = NotificationCenter.getInstance()

export function useNotificationBadge(
  channelId?: ValidChannelId
): number | undefined {
  const [badge, setBadge] = useState<number | undefined>(undefined)

  useEffect(() => {
    function loadBadge() {
      const badgeCount =
        notificationCenter.getBadgeAllUnreadNotifications(channelId)
      setBadge(badgeCount)
    }

    void loadBadge()
    const listener = notificationEventEmitter.addListener(
      "badge-change",
      loadBadge
    )

    return () => {
      listener.remove()
    }
  }, [])

  return badge
}
