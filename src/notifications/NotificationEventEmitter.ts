import { DeviceEventEmitter, EmitterSubscription } from "react-native"

export declare interface NotificationEventEmitter {
  addListener(
    eventType: "badge-change",
    listener: () => void
  ): EmitterSubscription
  addListener(
    eventType: "notification-remove",
    listener: () => void
  ): EmitterSubscription
  removeAllListeners(eventType?: "badge-change"): void
  removeAllListeners(eventType?: "notification-remove"): void
  emit(eventType: "badge-change"): void
  emit(eventType: "notification-remove"): void
}
export const notificationEventEmitter: NotificationEventEmitter =
  DeviceEventEmitter
