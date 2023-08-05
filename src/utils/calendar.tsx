/* eslint-disable @typescript-eslint/naming-convention */
import { DateData, MarkedDates } from "react-native-calendars/src/types"
import * as FileSystem from "expo-file-system"
import { EventEmitter } from "events"
import { ComponentType, useEffect, useMemo, useState } from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { DayProps } from "react-native-calendars/src/calendar/day"
import { Text } from "components/Text"
import { Canvas, Path, Skia } from "@shopify/react-native-skia"
import { palette } from "./colors"
import boomSvg from "assets/calendar/emoticons/boom.svg"
import brokenHeartSvg from "assets/calendar/emoticons/broken_heart.svg"
import cryFaceSvg from "assets/calendar/emoticons/cry_face.svg"
import desperateSvg from "assets/calendar/emoticons/desperate.svg"
import fallInLoveSvg from "assets/calendar/emoticons/fall_in_love.svg"
import grinningSvg from "assets/calendar/emoticons/grinning.svg"
import heartSvg from "assets/calendar/emoticons/heart.svg"
import laughingSvg from "assets/calendar/emoticons/laughing.svg"
import lookAsideSvg from "assets/calendar/emoticons/look_aside.svg"
import normalSmileSvg from "assets/calendar/emoticons/normal_smile.svg"
import oneHundredSvg from "assets/calendar/emoticons/one_hundred.svg"
import sickFaceSvg from "assets/calendar/emoticons/sick_face.svg"
import smileEyesClosedSvg from "assets/calendar/emoticons/smile_eyes_closed.svg"
import smileEyesOpenSvg from "assets/calendar/emoticons/smile_eyes_open.svg"
import smileEyesTriangleSvg from "assets/calendar/emoticons/smile_eyes_triangle.svg"
import smileWaterDropSvg from "assets/calendar/emoticons/smile_water_drop.svg"
import smileSvg from "assets/calendar/emoticons/smile.svg"
import starEyesSvg from "assets/calendar/emoticons/star_eyes.svg"

export const purpleBerry = "rgba(98, 96, 166, 1)"

export enum CalendarBottomSheetStatus {
  PERIODS,
  MONTHLY_EVENTS,
  DAILY_EVENTS,
  ADD_EVENT,
  EVENT_DETAILS,
}

export interface Period {
  start?: string
  end?: string
}

export interface CalendarPeriod {
  dates: Period[]
  title: string
  subtitle?: string
  color: string
  shown: boolean
}

export interface CalendarEvent {
  title: string

  //start and end are on the same day. iso dates for convenience
  start: string
  end: string

  //also a iso date
  reminder?: string

  //if remainder is every day?
  repeats?: boolean

  //this is weird
  mood?: ValidEmoticonName

  status: CalendarEventStatus

  id: string
}

export enum CalendarEventStatus {
  INITIAL,
  PROGRESS,
  COMPLETED,
}

const calendarPeriods: CalendarPeriod[] = [
  {
    dates: [{ start: "2023-08-01", end: "2023-08-24" }],
    title: "Vacanze",
    subtitle: "1/08 - 24/08",
    color: palette.goldish,
    shown: true,
  },
  {
    dates: [{ start: "2023-08-25", end: "2023-09-09" }],
    title: "Esami di profitto",
    subtitle: "23/08 - 31/08",
    color: purpleBerry,
    shown: true,
  },
  {
    dates: [
      { start: "2023-11-04", end: "2023-11-08" },
      { start: "2023-04-19", end: "2023-04-22" },
    ],
    title: "Prove in Itinere",
    color: "#F29999",
    shown: true,
  },
  {
    dates: [
      { start: "2023-09-28", end: "2023-09-30" },
      { start: "2023-03-08", end: "2023-03-09" },
      { start: "2023-09-19", end: "2023-09-21" },
    ],
    title: "Lauree 1° Livello",
    color: "#F28C52",
    shown: true,
  },
]

export declare interface CalendarSingletonWrapper {
  on(event: "calendarPeriodsChanged", listener: () => void): this

  on(event: "markedDatesSet", listener: () => void): this

  on(event: "calendarEventsChanged", listener: () => void): this
}

export class CalendarSingletonWrapper extends EventEmitter {
  private _markedDatesPeriods: MarkedDates = {}

  public get markedDatesPeriods(): MarkedDates | undefined {
    return this._markedDatesPeriods
  }
  private _calendarPeriods?: CalendarPeriod[]

  public get calendarPeriods(): CalendarPeriod[] | undefined {
    return this._calendarPeriods
  }

  private _calendarEvents: CalendarEvent[] = []

  public get calendarEvents(): CalendarEvent[] {
    return this._calendarEvents
  }

  public constructor() {
    super()
    void this._initializeCalendar()
  }
  private async _initializeCalendar() {
    await this._readEvents()
    await this._readCalendarPeriods()
    this._applyPeriods()
  }
  private _readEvents = async () => {
    try {
      const calendarEventsJSON = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + "calendar_events.json"
      )
      const calendarEvents = JSON.parse(calendarEventsJSON) as CalendarEvent[]
      this._calendarEvents = calendarEvents

      this.emit("calendarEventsChanged")
    } catch (err) {
      console.log(err)
      console.log("Error reading calendarEvents")
    }
  }

  private _writeEvents = async (events: CalendarEvent[]): Promise<boolean> => {
    const calendarEventsJSON = JSON.stringify(events)
    try {
      this._calendarEvents = events
      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + "calendar_events.json",
        calendarEventsJSON
      )
      return true
    } catch (err) {
      console.log(err)
      console.log("Error storing calendar events")
      return false
    }
  }

  private _readCalendarPeriods = async () => {
    try {
      const calendarPeriodsJSON = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + "calendar_periods.json"
      )
      const calendarPeriods = JSON.parse(
        calendarPeriodsJSON
      ) as CalendarPeriod[]
      this._calendarPeriods = calendarPeriods
    } catch (err) {
      console.log(err)
      console.log("Error reading calendarPeriods")
      this._calendarPeriods = calendarPeriods
      void this._writeCalendarPeriods(calendarPeriods)
    }
  }

  private _writeCalendarPeriods = async (
    periods: CalendarPeriod[]
  ): Promise<boolean> => {
    const calendarPeriodsJSON = JSON.stringify(periods)
    try {
      this._calendarPeriods = periods
      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + "calendar_periods.json",
        calendarPeriodsJSON
      )

      return true
    } catch (err) {
      console.log(err)
      console.log("Error storing periods ")
      return false
    }
  }

  private _applyPeriods() {
    this._markedDatesPeriods = {}
    this._calendarPeriods?.forEach(period => {
      if (!period.shown) return
      period.dates.forEach(date => {
        const periodTmp: MarkedDates = {}
        let tmpDate: string
        let tmpDateObj: Date
        let tmpDateEndObj: Date

        if (date.start && date.end) {
          if (date.start === date.end) {
            periodTmp[date.start] = {
              color: period.color,
              startingDay: true,
              endingDay: true,
            }
          } else {
            tmpDate = date.start
            tmpDateObj = new Date(tmpDate)
            tmpDateEndObj = new Date(date.end)

            //add first day
            periodTmp[tmpDate] = {
              color: period.color,
              startingDay: true,
            }

            const res = getNextDayFormattedDate(tmpDateObj)
            tmpDate = res.dateString
            tmpDateObj = res.dateObj

            while (tmpDateObj.getTime() < tmpDateEndObj.getTime()) {
              //add day in the middle
              periodTmp[tmpDate] = {
                color: period.color,
              }
              const res = getNextDayFormattedDate(tmpDateObj)
              tmpDate = res.dateString
              tmpDateObj = res.dateObj
            }

            //add last day
            periodTmp[tmpDate] = {
              color: period.color,
              endingDay: true,
            }
          }
        }

        this._markedDatesPeriods = { ...this._markedDatesPeriods, ...periodTmp }
      })
    })
    this._applyMarkers()
  }

  public updatePeriods = (title: string, val: boolean) => {
    const periods = this._calendarPeriods ?? []
    for (let i = 0; i < periods.length; i++) {
      if (periods[i].title === title) {
        periods[i].shown = val
        break
      }
    }

    this._calendarPeriods = periods.slice()

    this.emit("calendarPeriodsChanged")
    void this._writeCalendarPeriods(periods)
    this._applyPeriods()
  }

  public addEvent = (event: CalendarEvent) => {
    this._calendarEvents.push(event)

    this.emit("calendarEventsChanged")

    void this._writeEvents(this._calendarEvents)

    void this._applyMarkers()
  }

  private _applyMarkers = () => {
    for (let i = 0; i < this._calendarEvents.length; i++) {
      const dateString = this._calendarEvents[i].start.substring(0, 10)

      this._markedDatesPeriods[dateString] = {
        ...this._markedDatesPeriods[dateString],
        marked: true,
      }
    }

    this.emit("markedDatesSet")
  }

  private _removeMarkers = (dateString: string) => {
    const isAtLeastOneEvent = this.calendarEvents.find(
      event => event.start.substring(0, 10) === dateString
    )
    if (isAtLeastOneEvent) return

    this._markedDatesPeriods[dateString] = {
      ...this._markedDatesPeriods[dateString],
      marked: false,
    }

    this.emit("markedDatesSet")
  }

  public removeEvent = (id: string) => {
    const index = this._calendarEvents.findIndex(event => event.id === id)

    if (index === -1) return

    const removedElement = this._calendarEvents.splice(index, 1)[0]

    this.emit("calendarEventsChanged")

    void this._writeEvents(this._calendarEvents)

    void this._removeMarkers(removedElement.start.substring(0, 10))
  }
}

const getNextDayFormattedDate = (
  date: Date
): { dateString: string; dateObj: Date } => {
  const dateObj = new Date(date.getTime() + 86400000)

  const dateString = dateObj.toISOString().split("T")[0]

  return { dateString, dateObj }
}

export const monthsIt = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
]

export const monthsEn = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Augost",
  "September",
  "October",
  "November",
  "December",
]

export const monthsAcronymsIt = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
]

export const monthsAcronymsEn = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Augost",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const FILLER_HEIGHT = 26

export const dayComponentCustom: ComponentType<
  DayProps & {
    date?: DateData | undefined
  }
> = props => {
  const {
    theme,
    marking,
    date,
    onPress,
    onLongPress,
    /*  state,
    accessibilityLabel,
    testID, */
    children,
  } = props

  const dateData = dateToDateData(date)

  const [isMarked, setIsMarked] = useState(marking?.marked ?? false)

  useEffect(() => {
    setIsMarked(marking?.marked ?? false)
  }, [marking])

  const fillerStyles = useMemo(() => {
    const leftFillerStyle: ViewStyle = { flex: 1 }
    const rightFillerStyle: ViewStyle = { flex: 1 }
    let globalfiller: ViewStyle = {}

    const start = marking?.startingDay
    const end = marking?.endingDay

    if (start && !end) {
      rightFillerStyle.borderBottomColor = marking?.color
      rightFillerStyle.borderBottomWidth = 2
      rightFillerStyle.borderTopColor = marking?.color
      rightFillerStyle.borderTopWidth = 2
    } else if (end && !start) {
      leftFillerStyle.borderBottomColor = marking?.color
      leftFillerStyle.borderBottomWidth = 2
      leftFillerStyle.borderTopColor = marking?.color
      leftFillerStyle.borderTopWidth = 2
    } else if (marking?.color && !start && !end) {
      globalfiller = {
        borderBottomColor: marking?.color,
        borderBottomWidth: 2,
        borderTopColor: marking?.color,
        borderTopWidth: 2,
      }
    }
    return { leftFillerStyle, rightFillerStyle, globalfiller }
  }, [marking])

  const path = useMemo(() => {
    let startAngle
    let sweepAngle

    if (marking?.startingDay && marking.endingDay) {
      startAngle = 90
      sweepAngle = 360
    } else if (marking?.startingDay) {
      startAngle = 90
      sweepAngle = 180
    } else if (marking?.endingDay) {
      startAngle = 270
      sweepAngle = 180
    } else {
      return undefined
    }

    const path = Skia.Path.Make()
    path.moveTo(19, 1)
    //this looks kinda random
    path.addArc(
      { height: FILLER_HEIGHT - 2, width: 30, y: 1, x: 4 },
      startAngle,
      sweepAngle
    )

    return path
  }, [marking])

  return (
    <TouchableOpacity
      style={{ alignSelf: "stretch" }}
      onPress={
        onPress
          ? () => {
              onPress(dateData)
            }
          : undefined
      }
      onLongPress={onLongPress ? () => onLongPress(dateData) : undefined}
    >
      <View
        style={{
          alignItems: "center",
          alignSelf: "stretch",
          marginLeft: -1,
        }}
      >
        <View
          style={[
            {
              position: "absolute",
              height: FILLER_HEIGHT,
              flexDirection: "row",
              left: 0,
              right: 0,
            },
            fillerStyles.globalfiller,
          ]}
        >
          <View style={fillerStyles.leftFillerStyle} />

          <View style={fillerStyles.rightFillerStyle} />
        </View>
        {path && (
          <Canvas
            style={{
              width: 38,
              height: FILLER_HEIGHT,
              position: "absolute",
              zIndex: 10,
            }}
          >
            <Path
              path={path}
              color={marking?.color}
              strokeWidth={2}
              fillType={undefined}
              style="stroke"
            />
          </Canvas>
        )}
        <View
          style={{
            borderRadius: 17,
            width: 38,
            height: FILLER_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: 12, fontWeight: "900" }}
            allowFontScaling={false}
          >
            {String(children)}
          </Text>
          <View style={{ position: "absolute", top: 7, right: 7 }}>
            {isMarked && (
              <View
                style={{
                  backgroundColor: theme?.dotColor,
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                }}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const dateToDateData = (
  date: (string & DateData) | undefined
): DateData | undefined => {
  if (date) {
    if (typeof date === "string") {
      const d = new Date(date)

      return {
        day: d.getDate(),
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        dateString: d.toISOString().substring(0, 10),
        timestamp: d.getTime(),
      }
    } else {
      return date
    }
  }
  return undefined
}

export const daysOfWeekLetters = ["L", "M", "M", "G", "V", "S", "D"]

export const daysOfWeekAcronymsIt = [
  "Lun",
  "Mar",
  "Mer",
  "Gio",
  "Ven",
  "Sab",
  "Dom",
]

export const daysOfWeekAcronymsEn = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
]

const daysOfWeekIt = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
]

const daysOfWeekEn = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

export const formatCalendarEventDay = (event: CalendarEvent, lan: string) => {
  const date = new Date(event.start)

  const day = date.getDate()

  const month = date.getMonth() + 1

  const dayNumber = date.getDay()

  let dayOfTheWeek

  if (lan === "it") {
    dayOfTheWeek = daysOfWeekIt[dayNumber]
  } else {
    dayOfTheWeek = daysOfWeekEn[dayNumber]
  }

  return `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")} | ${dayOfTheWeek}`
}

export type ValidEmoticonName =
  | "boom"
  | "broken_heart"
  | "cry_face"
  | "desperate"
  | "fall_in_love"
  | "grinning"
  | "heart"
  | "laughing"
  | "look_aside"
  | "normal_smile"
  | "one_hundred"
  | "sick_face"
  | "smile_eyes_closed"
  | "smile_eyes_open"
  | "smile_eyes_triangle"
  | "smile_water_drop"
  | "smile"
  | "star_eyes"

// Type guard function to check if the string is a ValidEmoticonName
export function isValidEmoticonName(name: string): name is ValidEmoticonName {
  return [
    "boom",
    "broken_heart",
    "cry_face",
    "desperate",
    "fall_in_love",
    "grinning",
    "heart",
    "laughing",
    "look_aside",
    "normal_smile",
    "one_hundred",
    "sick_face",
    "smile_eyes_closed",
    "smile_eyes_open",
    "smile_eyes_triangle",
    "smile_water_drop",
    "smile",
    "star_eyes",
  ].includes(name)
}

export const emoticons: Record<ValidEmoticonName, number> = {
  boom: boomSvg,
  broken_heart: brokenHeartSvg,
  cry_face: cryFaceSvg,
  desperate: desperateSvg,
  fall_in_love: fallInLoveSvg,
  grinning: grinningSvg,
  heart: heartSvg,
  laughing: laughingSvg,
  look_aside: lookAsideSvg,
  normal_smile: normalSmileSvg,
  one_hundred: oneHundredSvg,
  sick_face: sickFaceSvg,
  smile_eyes_closed: smileEyesClosedSvg,
  smile_eyes_open: smileEyesOpenSvg,
  smile_eyes_triangle: smileEyesTriangleSvg,
  smile_water_drop: smileWaterDropSvg,
  smile: smileSvg,
  star_eyes: starEyesSvg,
}

export const getSourceEmoticon = (emoticon: ValidEmoticonName | undefined) => {
  if (emoticon) {
    return emoticons[emoticon]
  } else {
    return smileSvg
  }
}

export const fromatAddEventDate = (date: Date, lan: string) => {
  const day = date.getDay()

  let acronymDay
  let monthAcronym
  const dayNumber = date.getDate()
  const year = date.getFullYear()

  if (lan === "it") {
    acronymDay = daysOfWeekAcronymsIt[day]
    monthAcronym = monthsAcronymsIt[date.getMonth()]
  } else {
    acronymDay = daysOfWeekAcronymsEn[day]
    monthAcronym = monthsAcronymsEn[date.getMonth()]
  }

  return `${acronymDay} ${dayNumber} ${monthAcronym} ${year}`
}

export const get1HourBeforeAfterSameDay = (
  date: Date,
  after: boolean
): Date => {
  let newDate = date
  if (after) {
    newDate = new Date(date.getTime() + 60 * 60 * 1000)

    //if the new end date is not the same day as the start date set to midnight
    if (newDate.getDate() !== date.getDate()) {
      newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59
      )
    }
  } else {
    newDate = new Date(date.getTime() - 60 * 60 * 1000)

    //if the new start date is not the same day as the end date set to midnight
    if (newDate.getDate() !== date.getDate()) {
      newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0
      )
    }
  }

  return newDate
}
