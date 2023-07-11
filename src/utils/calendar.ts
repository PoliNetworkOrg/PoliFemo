import { MarkedDates } from "react-native-calendars/src/types"
import * as FileSystem from "expo-file-system"
import { EventEmitter } from "events"

export const dotColorGold = "rgba(242, 186, 82, 1)"
export const purpleBerry = "rgba(98, 96, 166, 1)"

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
  mood?: string

  status: CalendarEventStatus
}

export enum CalendarEventStatus {
  INITIAL,
  PROGRESS,
  COMPLETED,
}

const calendarPeriods: CalendarPeriod[] = [
  {
    dates: [{ start: "2023-08-01", end: "2023-08-22" }],
    title: "Vacanze",
    subtitle: "1/08 - 22/08",
    color: dotColorGold,
    shown: true,
  },
  {
    dates: [{ start: "2023-08-23", end: "2023-08-31" }],
    title: "Esami di profitto",
    subtitle: "23/08 - 31/08",
    color: purpleBerry,
    shown: true,
  },
]

export declare interface CalendarSingletonWrapper {
  on(event: "calendarPeriodsChanged", listener: () => void): this

  on(event: "markedDatesSet", listener: () => void): this
}

export class CalendarSingletonWrapper extends EventEmitter {
  private static classInstance?: CalendarSingletonWrapper

  private _markedDatesPeriods: MarkedDates | undefined

  public get markedDatesPeriods(): MarkedDates | undefined {
    return this._markedDatesPeriods
  }
  private _calendarPeriods?: CalendarPeriod[]

  public get calendarPeriods(): CalendarPeriod[] | undefined {
    return this._calendarPeriods
  }

  private _calendarEvents: CalendarEvent[] = []

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new CalendarSingletonWrapper()
    }

    return this.classInstance
  }

  private constructor() {
    super()
    void this._initializeCalendar()
  }
  private async _initializeCalendar() {
    await this._readEvents()
    await this._readCalendarPeriods()
    this._applyPeriods()
    /* this._markedDatesMerging() */
  }
  private _readEvents = async () => {
    try {
      const calendarEventsJSON = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + "calendar_events.json"
      )
      const calendarEvents = JSON.parse(calendarEventsJSON) as CalendarEvent[]
      this._calendarEvents = calendarEvents
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

        this.emit("markedDatesSet")
        return
      })
    })
    this.emit("markedDatesSet")
  }

  public updatePeriods = (title: string, val: boolean) => {
    console.log(val)
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
  /* private _markedDatesMerging() {
    throw new Error("Method not implemented.")
  } */
}

const getNextDayFormattedDate = (
  date: Date
): { dateString: string; dateObj: Date } => {
  const dateObj = new Date(date.getTime() + 86400000)

  const dateString = dateObj.toISOString().split("T")[0]

  return { dateString, dateObj }
}

export const months = [
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
