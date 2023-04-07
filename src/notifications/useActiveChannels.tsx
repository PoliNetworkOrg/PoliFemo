import { NotificationCentre } from "./NotificationCentre"
import { useState, useEffect } from "react"
import { NotificationsChannels } from "./NotificationTypes"

const notificationCentre = NotificationCentre.getInstance()

export function useNotificationsChannels() {
  const [activeChannels, setActiveChannels] =
    useState<NotificationsChannels>(undefined)

  useEffect(() => {
    function loadActiveChannels() {
      const activeChannels = notificationCentre.activeChannels
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
