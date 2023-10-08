import { EmitterSubscription, DeviceEventEmitter } from "react-native"

/**
 * enum to differentiate the different types of event we could have
 */
export enum EventType {
  LECTURES = 1,
  EXAMS = 2,
  NEWS = 3,
  DEADLINE = 4,
  CUSTOM = 5,
}

export declare interface NewsSheetEventEmitter {
  addListener(
    eventType: "should_close",
    listener: () => void
  ): EmitterSubscription
  addListener(
    eventType: "state_change",
    listener: (open: boolean) => void
  ): EmitterSubscription
  removeAllListeners(eventType?: "should_close"): void
  removeAllListeners(eventType?: "state_change"): void
  emit(eventType: "should_close"): void
  emit(eventType: "state_change", open: boolean): void
}
export const newsSheetEventEmitter: NewsSheetEventEmitter = DeviceEventEmitter
