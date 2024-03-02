/* eslint-disable @typescript-eslint/naming-convention */
import { MarkedDates } from "react-native-calendars/src/types"
import { EventEmitter } from "events"
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
import { api } from "api"
import { Event } from "api/collections/event"
import { NotificationCenter } from "notifications/NotificationCenter"

export const purpleBerry = "rgba(98, 96, 166, 1)"

export enum CalendarBottomSheetStatus {
  PERIODS,
  MONTHLY_EVENTS,
  DAILY_EVENTS,
  ADD_EVENT,
  EVENT_DETAILS,
  ALL_MONTHS,
}

export interface Period {
  start?: string
  end?: string
}

export interface CalendarPeriod {
  dates: Period[]
  title: string
  titleEn?: string
  subtitle?: string
  color: string
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

  isPolimiEvent?: boolean

  titleEn?: string

  polimiEventFields?: Partial<Event>

  notes?: string
}

export enum CalendarEventStatus {
  INITIAL,
  PROGRESS,
  COMPLETED,
}

export interface CalendarPolimiSyncObj {
  matricola?: string
  lastSync?: string
}

const calendarPeriods: CalendarPeriod[] = [
  {
    dates: [
      { start: "2023-08-01", end: "2023-08-24" },
      { start: "2023-12-23", end: "2023-12-23" },
      { start: "2023-12-27", end: "2023-12-30" },
      { start: "2024-01-01", end: "2024-01-05" },
      { start: "2024-03-29", end: "2024-03-30" },
      { start: "2024-04-02", end: "2024-04-02" },
    ],
    title: "Vacanze",
    titleEn: "Holidays",
    subtitle: "1/08 - 24/08",
    color: palette.goldish,
  },
  {
    dates: [
      { start: "2023-08-28", end: "2023-09-02" },
      { start: "2023-09-04", end: "2023-09-09" },
      { start: "2023-09-11", end: "2023-09-12" },
      { start: "2024-01-08", end: "2024-01-13" },
      { start: "2024-01-15", end: "2024-01-20" },
      { start: "2024-01-22", end: "2024-01-27" },
      { start: "2024-01-29", end: "2024-02-03" },
      { start: "2024-02-05", end: "2024-02-10" },
      { start: "2024-02-12", end: "2024-02-17" },
      { start: "2024-06-06", end: "2024-06-08" },
      { start: "2024-06-10", end: "2024-06-15" },
      { start: "2024-06-17", end: "2024-06-22" },
      { start: "2024-06-24", end: "2024-06-29" },
      { start: "2024-07-01", end: "2024-07-06" },
      { start: "2024-07-08", end: "2024-07-13" },
      { start: "2024-07-15", end: "2024-07-15" },
      { start: "2024-07-20", end: "2024-07-20" },
      { start: "2024-07-22", end: "2024-07-27" },
      { start: "2024-08-26", end: "2024-08-31" },
    ],
    title: "Esami di profitto",
    titleEn: "Profit exams",
    subtitle: "23/08 - 31/08",
    color: purpleBerry,
  },
  {
    dates: [
      { start: "2023-11-03", end: "2023-11-04" },
      { start: "2023-11-06", end: "2023-11-07" },
      { start: "2024-04-11", end: "2024-04-13" },
      { start: "2024-04-15", end: "2024-04-15" },
    ],
    title: "Prove in Itinere",
    titleEn: "Midterm exams",
    color: "#F29999",
  },
  {
    dates: [
      { start: "2023-09-27", end: "2023-09-28" },
      { start: "2024-03-06", end: "2024-03-07" },
      { start: "2024-07-18", end: "2024-07-19" },
    ],
    title: "Lauree 1° Livello",
    titleEn: "Bachelor's degree",
    color: "#F28C52",
  },
  {
    dates: [
      { start: "2023-10-04", end: "2023-10-05" },
      { start: "2023-12-19", end: "2023-12-19" },
      { start: "2023-12-21", end: "2023-12-21" },
      { start: "2024-04-09", end: "2024-04-10" },
      { start: "2024-07-16", end: "2024-07-17" },
    ],
    title: "Lauree Magistrali",
    titleEn: "Master's degree",
    color: "#96CEAD",
  },
  {
    dates: [
      { start: "2023-12-31", end: "2023-10-09" },
      { start: "2023-12-24", end: "2023-12-26" },
      { start: "2024-01-06", end: "2024-01-07" },
      { start: "2024-03-31", end: "2024-04-01" },
    ],
    title: "Festività",
    titleEn: "Festivities",
    color: "#F29999",
  },
]

export function addMarkForEvents(
  markedDates: MarkedDates,
  events: Event[] | null
): MarkedDates {
  if (events) {
    events.forEach(event => {
      const start = event.date_start.substring(0, 10)
      markedDates[start] = {
        ...markedDates[start],
        marked: true,
      }
    })
  }

  return markedDates
}

export function addMarkForPeriods(
  markedDates: MarkedDates,
  periodFilters: number[]
): MarkedDates {
  calendarPeriods
    .filter((_, i) => !periodFilters.includes(i))
    .forEach(period =>
      period.dates.forEach(date => {
        if (!date.start || !date.end) return
        let tmpDate: string
        let tmpDateObj: Date
        let tmpDateEndObj: Date

        if (date.start === date.end) {
          markedDates[date.start] = {
            ...markedDates[date.start],
            color: period.color,
            startingDay: true,
            endingDay: true,
          }
        } else {
          tmpDate = date.start
          tmpDateObj = new Date(tmpDate)
          tmpDateEndObj = new Date(date.end)

          //add first day
          markedDates[tmpDate] = {
            ...markedDates[tmpDate],
            color: period.color,
            startingDay: true,
          }

          const res = getNextDayFormattedDate(tmpDateObj)
          tmpDate = res.dateString
          tmpDateObj = res.dateObj

          while (tmpDateObj.getTime() < tmpDateEndObj.getTime()) {
            //add day in the middle
            markedDates[tmpDate] = {
              ...markedDates[tmpDate],
              color: period.color,
            }
            const res = getNextDayFormattedDate(tmpDateObj)
            tmpDate = res.dateString
            tmpDateObj = res.dateObj
          }

          //add last day
          markedDates[tmpDate] = {
            ...markedDates[tmpDate],
            color: period.color,
            endingDay: true,
          }
        }
      })
    )
  return markedDates
}

export declare interface CalendarSingletonWrapperInterface {
  on(event: "calendarPeriodsChanged", listener: () => void): this

  on(event: "markedDatesSet", listener: () => void): this

  on(event: "calendarEventsChanged", listener: () => void): this
}

export class CalendarSingletonWrapper
  extends EventEmitter
  implements CalendarSingletonWrapperInterface
{
  private _datesMarkedAndPeriods: MarkedDates = {}

  public get datesMarkedAndPeriods(): MarkedDates | undefined {
    return this._datesMarkedAndPeriods
  }
  private _calendarPeriods?: CalendarPeriod[]

  // if true all periods wont be shown even though they are switched on
  private _hidePeriods = false

  public get hidePeriods(): boolean {
    return this._hidePeriods
  }

  public get calendarPeriods(): CalendarPeriod[] | undefined {
    return this._calendarPeriods
  }

  private _calendarEvents: CalendarEvent[] = []

  public get calendarEvents(): CalendarEvent[] {
    return this._calendarEvents
  }

  private _matricola?: string

  public get matricola(): string | undefined {
    return this._matricola
  }

  //matricola and last sync date with polimi events
  private _calendarPolimiSync?: CalendarPolimiSyncObj

  private _notificationCentre = NotificationCenter.getInstance()

  public constructor({
    hidePeriods = false,
    matricola,
  }: {
    hidePeriods?: boolean
    matricola?: string
  }) {
    super()
    //weather or not I want to hide the periods as soon as the object is created
    this._hidePeriods = hidePeriods
    this._matricola = matricola
    void this._initializeCalendar()
  }
  private async _initializeCalendar() {
    await this._readEvents()
    await this._readCaledarPolimiSync()
    this._calendarPeriods = calendarPeriods
    this._applyPeriods()
    this._checkNeedSyncingPolimiEvents()
  }

  public updateNotes = (id: string, notes: string) => {
    const index = this._calendarEvents.findIndex(event => event.id === id)

    if (index === -1) return

    this._calendarEvents[index].notes = notes

    void this._writeEvents(this._calendarEvents)

    this.emit("calendarEventsChanged")
  }

  public changeMatricola = (matricola?: string) => {
    this._matricola = matricola

    this._checkNeedSyncingPolimiEvents()
  }

  private _checkNeedSyncingPolimiEvents = () => {
    if (this._matricola == null) {
      //oldMatricola set && newMatricola undefined
      if (this._calendarPolimiSync?.matricola) {
        this._cleanCalendarEventsFromPolimiEvents({ calledBeforeSync: false })

        //update sync obj
        this._calendarPolimiSync = {}
        void this._writeCalendarPolimiSync({})
      } else {
        //oldMatricola undefined && newMatricola undefined
        return
      }
    } else {
      //oldMatricola undefined && newMatricola set
      if (this._calendarPolimiSync?.matricola == null) {
        //sync
        void this._syncPolimiEvents()

        //sync events with new matricola
      } else if (this._calendarPolimiSync?.matricola !== this._matricola) {
        //oldMatricola set && newMatricola set but they are different => clean and sync
        this._cleanCalendarEventsFromPolimiEvents({ calledBeforeSync: true })

        void this._syncPolimiEvents()
      } else {
        //oldMatricola set && newMatricola set && they are equal => sync if last sync is older than 7 days
        if (this._calendarPolimiSync.lastSync) {
          const lastSyncDate = new Date(this._calendarPolimiSync.lastSync)

          const now = new Date()

          const diff = now.getTime() - lastSyncDate.getTime()

          const days = diff / (1000 * 3600 * 24)

          if (days > 7) {
            void this._syncPolimiEvents()
          }
        } else {
          void this._syncPolimiEvents()
        }
      }
    }
  }

  private _cleanCalendarEventsFromPolimiEvents = ({
    calledBeforeSync = false,
  }) => {
    const newArray = this._calendarEvents.filter(event => !event.isPolimiEvent)

    const hasChanged = newArray.length !== this._calendarEvents.length

    this._calendarEvents = newArray

    // dont write events and apply markers if called before sync
    if (!calledBeforeSync && hasChanged) {
      void this._writeEvents(this._calendarEvents)

      void this._applyMarkers()

      this.emit("calendarEventsChanged")
    }
  }

  private _syncPolimiEvents = async () => {
    if (this._matricola == null) {
      return
    }

    const events: Event[] = await api.events.getEvents({
      matricola: this._matricola,
      startDate: new Date().toISOString().substring(0, 10),
      nEvents: 20,
    })

    events.forEach(event => {
      if (
        !this._calendarEvents.find(
          calendarEvent => calendarEvent.id === event.event_id.toString()
        )
      ) {
        this._calendarEvents.push({
          id: event.event_id.toString(),
          end: event.date_end,
          start: event.date_start,
          title: event.title.it,
          titleEn: event.title.en,
          status: CalendarEventStatus.INITIAL,
          isPolimiEvent: true,
          polimiEventFields: event,
        })
      }
    })

    void this._writeEvents(this._calendarEvents)

    this.emit("calendarEventsChanged")

    void this._applyMarkers()

    //write latest sync date
    this._calendarPolimiSync = {
      matricola: this._matricola,
      lastSync: new Date().toISOString(),
    }
    void this._writeCalendarPolimiSync(this._calendarPolimiSync)
  }

  private _readCaledarPolimiSync = async () => {
    // try {
    //   const calendarPolimiSyncJSON = await FileSystem.readAsStringAsync(
    //     FileSystem.documentDirectory + "calendar_polimi_sync.json"
    //   )
    //   const calendarPolimiSync = JSON.parse(
    //     calendarPolimiSyncJSON
    //   ) as CalendarPolimiSyncObj
    //   this._calendarPolimiSync = calendarPolimiSync
    // } catch (err) {
    //   console.log(err)
    //   console.log("Error reading calendarPolimiSync")
    //   this._calendarPolimiSync = undefined
    // }
  }

  private _writeCalendarPolimiSync = async (
    calendarPolimiSync: CalendarPolimiSyncObj
  ): Promise<void> => {
    // const calendarPolimiSyncJSON = JSON.stringify(calendarPolimiSync)
    // try {
    //   this._calendarPolimiSync = calendarPolimiSync
    //   await FileSystem.writeAsStringAsync(
    //     FileSystem.documentDirectory + "calendar_polimi_sync.json",
    //     calendarPolimiSyncJSON
    //   )
    //   return true
    // } catch (err) {
    //   console.log(err)
    //   console.log("Error storing calendarPolimiSync ")
    //   return false
    // }
  }

  private _readEvents = async () => {
    // try {
    //   const calendarEventsJSON = await FileSystem.readAsStringAsync(
    //     FileSystem.documentDirectory + "calendar_events.json"
    //   )
    //   const calendarEvents = JSON.parse(calendarEventsJSON) as CalendarEvent[]
    //   this._calendarEvents = calendarEvents
    //   this.emit("calendarEventsChanged")
    // } catch (err) {
    //   console.log(err)
    //   console.log("Error reading calendarEvents")
    // }
  }

  private _writeEvents = async (events: CalendarEvent[]): Promise<void> => {
    // const calendarEventsJSON = JSON.stringify(events)
    // try {
    //   this._calendarEvents = events
    //   await FileSystem.writeAsStringAsync(
    //     FileSystem.documentDirectory + "calendar_events.json",
    //     calendarEventsJSON
    //   )
    //   return true
    // } catch (err) {
    //   console.log(err)
    //   console.log("Error storing calendar events")
    //   return false
    // }
  }

  private _applyPeriods() {
    this._datesMarkedAndPeriods = {}

    const periods = this._hidePeriods ? [] : this._calendarPeriods

    periods?.forEach(period => {
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

        this._datesMarkedAndPeriods = {
          ...this._datesMarkedAndPeriods,
          ...periodTmp,
        }
      })
    })
    this._applyMarkers()
  }

  public updatePeriods = (title: string, val: boolean) => {
    const periods = this._calendarPeriods ?? []
    for (let i = 0; i < periods.length; i++) {
      if (periods[i].title === title) {
        break
      }
    }

    // create a new array to trigger the change
    this._calendarPeriods = periods.slice()

    this.emit("calendarPeriodsChanged")

    this._applyPeriods()
  }

  public hideAllPerdiods = () => {
    this._hidePeriods = true
    this._applyPeriods()
  }

  public showSwitchedOnPeriods = () => {
    this._hidePeriods = false
    this._applyPeriods()
  }

  public addEvent = (event: CalendarEvent) => {
    this._calendarEvents.push(event)

    this.emit("calendarEventsChanged")

    void this._writeEvents(this._calendarEvents)

    void this._applyMarkers()

    if (event.reminder) {
      void this._notificationCentre.scheduledNotificationFromCalendarEvent(
        event
      )
    }
  }

  private _applyMarkers = () => {
    for (let i = 0; i < this._calendarEvents.length; i++) {
      const dateString = this._calendarEvents[i].start.substring(0, 10)

      this._datesMarkedAndPeriods[dateString] = {
        ...this._datesMarkedAndPeriods[dateString],
        marked: true,
      }
    }

    this._datesMarkedAndPeriods = { ...this._datesMarkedAndPeriods }

    this.emit("markedDatesSet")
  }

  private _removeMarkers = (dateString: string) => {
    const isAtLeastOneEvent = this.calendarEvents.find(
      event => event.start.substring(0, 10) === dateString
    )
    if (isAtLeastOneEvent) return

    this._datesMarkedAndPeriods[dateString] = {
      ...this._datesMarkedAndPeriods[dateString],
      marked: false,
    }

    this._datesMarkedAndPeriods = { ...this._datesMarkedAndPeriods }

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

  public changeEventStatus = (id: string, status: CalendarEventStatus) => {
    const index = this._calendarEvents.findIndex(event => event.id === id)

    if (index === -1) return

    this._calendarEvents[index].status = status

    this.emit("calendarEventsChanged")
    void this._writeEvents(this._calendarEvents)
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
  "August",
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

export const formatDateCalendarDetails = (event?: CalendarEvent) => {
  if (!event) return ""
  const date = new Date(event.start)

  const day = date.getDate()

  const month = date.getMonth() + 1

  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export const formatHoursFromDate = (dateString?: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)

  const hour = date.getHours()

  const minutes = date.getMinutes()

  return `${hour.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`
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

export const getBackColorFromEventStatus = (
  status: CalendarEventStatus,
  isLight: boolean
): string => {
  switch (status) {
    case CalendarEventStatus.INITIAL:
      return isLight ? "#F2F2F2" : "#D7D9E2"
    case CalendarEventStatus.PROGRESS:
      return "#F29999"
    case CalendarEventStatus.COMPLETED:
      return isLight ? palette.primary : "#9BC0D8"
  }
}

export const getTextFromEventStatus = (
  status: CalendarEventStatus,
  lan: string
): string => {
  switch (status) {
    case CalendarEventStatus.INITIAL:
      return lan === "it" ? "Prossimo" : "Next"
    case CalendarEventStatus.PROGRESS:
      return lan === "it" ? "In corso" : "In progress"
    case CalendarEventStatus.COMPLETED:
      return lan === "it" ? "Completato" : "Completed"
  }
}

export const shiftedEventStatus = (
  status: CalendarEventStatus
): CalendarEventStatus => {
  switch (status) {
    case CalendarEventStatus.INITIAL:
      return CalendarEventStatus.PROGRESS
    case CalendarEventStatus.PROGRESS:
      return CalendarEventStatus.COMPLETED
    case CalendarEventStatus.COMPLETED:
      return CalendarEventStatus.INITIAL
  }
}
