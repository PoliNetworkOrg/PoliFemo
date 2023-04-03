import { NotificationTriggerInput } from "expo-notifications"
import { WidgetType } from "./carousel"

export interface MinutesBeforeOptions {
  deadline?: number
  exam?: number
  lecture?: number
}
const MINUTES_BEFORE_EVENT = 30
const DELTA_MILLISECONDS = MINUTES_BEFORE_EVENT * 60 * 1000

export const getMinutesBeforeInMilliseconds = (
  minutesOption?: MinutesBeforeOptions,
  type?: WidgetType
) => {
  let minutes
  if (type === WidgetType.DEADLINE) {
    minutes = minutesOption?.deadline
  } else if (type === WidgetType.EXAMS) {
    minutes = minutesOption?.exam
  } else if (type === WidgetType.LECTURES) {
    minutes = minutesOption?.lecture
  }
  if (minutes) {
    return minutes * 60 * 1000
  }
  return DELTA_MILLISECONDS
}

//User defined typeguard to check trigger input. Only check relevant info
interface MyDateTriggerInterface {
  date: Date | number
}

function isDateTriggerInput(input: unknown): input is MyDateTriggerInterface {
  return (
    typeof input === "object" &&
    input !== null &&
    "date" in input &&
    (typeof input.date === "number" || input.date instanceof Date)
  )
}

function isTimeIntervalTriggerInput(
  input: unknown
): input is { seconds: number } {
  return (
    typeof input === "object" &&
    input !== null &&
    "seconds" in input &&
    typeof input.seconds === "number"
  )
}

function isWeeklyTriggerInput(
  input: unknown
): input is { weekday: number; hour: number; minute: number } {
  return (
    typeof input === "object" &&
    input !== null &&
    "weekday" in input &&
    typeof input.weekday === "number" &&
    "hour" in input &&
    typeof input.hour === "number" &&
    "minute" in input &&
    typeof input.minute === "number"
  )
}

function isDailyTriggerInput(
  input: unknown
): input is { hour: number; minute: number } {
  return (
    typeof input === "object" &&
    input !== null &&
    "hour" in input &&
    "minute" in input &&
    typeof input.minute === "number" &&
    typeof input.hour === "number"
  )
}

export const calculateDateFromTrigger = (trigger: NotificationTriggerInput) => {
  let relevantDate: Date | undefined
  if (trigger instanceof Date) {
    relevantDate = trigger
  } else if (typeof trigger === "number") {
    relevantDate = new Date(trigger)
  } else if (isDateTriggerInput(trigger)) {
    if (typeof trigger.date === "number") {
      relevantDate = new Date(trigger.date)
    } else {
      relevantDate = trigger.date
    }
  } else if (isTimeIntervalTriggerInput(trigger)) {
    relevantDate = new Date(new Date().getTime() + trigger.seconds * 1000)
  } else if (isDailyTriggerInput(trigger)) {
    relevantDate = new Date(
      new Date().getTime() +
        trigger.minute * 60 * 1000 +
        trigger.hour * 60 * 60 * 1000
    )
  } else if (isWeeklyTriggerInput(trigger)) {
    const weekDay = trigger.weekday
    const nowDay = new Date().getDay()
    let dayDifference = weekDay - nowDay
    if (dayDifference < 0) {
      dayDifference += 7
    }
    relevantDate = new Date(
      new Date().getTime() +
        trigger.minute * 60 * 1000 +
        trigger.hour * 60 * 60 * 1000 +
        dayDifference * 24 * 60 * 60 * 1000
    )
  }
  return relevantDate
}
