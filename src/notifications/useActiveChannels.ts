import { NotificationCenter } from "./NotificationCenter"
import { useState, useEffect } from "react"
import { NotificationsChannels } from "./NotificationTypes"

const notificationCenter = NotificationCenter.getInstance()

export function useNotificationsChannels() {
  const [activeChannels, setActiveChannels] = useState<NotificationsChannels>({
    associazioni: true,
    comunicazioni: true,
    upload: true,
  })

  useEffect(() => {
    function loadActiveChannels() {
      const activeChannels = notificationCenter.activeChannels
      setActiveChannels(activeChannels)
    }

    void loadActiveChannels()
  }, [])

  return {
    activeChannels: activeChannels,
    setActiveChannels: (channels: NotificationsChannels) => {
      setActiveChannels(channels)
    },
  }
}
