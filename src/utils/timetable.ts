/* eslint-disable @typescript-eslint/naming-convention */
import { api } from "api"
import { Event } from "api/collections/event"
import * as FileSystem from "expo-file-system"
import { EventType } from "./events"
import { EventEmitter } from "events"

/**
 * A more systematic approach for managing margins, change here, change everywhere.
 *
 */

export const LECTURE_WIDTH = 64

export const LECTURE_HEIGHT_OPEN = 90

export const LECTURE_HEIGHT_COLLAPSED = 26

export const LECTURE_HEIGHT_COLLAPSED_NOT_SELECTED = 20

//space between a one-hour slot
export const TIME_SLOT = LECTURE_WIDTH / 2

//nudging times slightly to the right
export const CORRECTION_TIMELINE_FACTOR = 0.9

//padding around lectures
export const LECTURE_CONTAINER_PADDING = 4

//space between multi-rows
export const LECTURE_ROW_DISTANCE = 16

//space between adjacent lectures (subtracted to width and added to left distance (x2))
export const ATTACHED_LECTURES_MARGIN = 1

const dayMappingObject: Record<number, ValidDayTimeTable> = {
  1: "lun",
  2: "mar",
  3: "mer",
  4: "gio",
  5: "ven",
  6: "sab",
  0: "dom",
}

const dayStringMappingObject: Record<number, { it: string; en: string }> = {
  1: { it: "Lunedì", en: "Monday" },
  2: { it: "Martedì", en: "Tuesday" },
  3: { it: "Mercoledì", en: "Wednesday" },
  4: { it: "Giovedì", en: "Thursday" },
  5: { it: "Venerdì", en: "Friday" },
  6: { it: "Sabato", en: "Saturday" },
  0: { it: "Domenica", en: "Sunday" },
}

export type ValidDayTimeTable =
  | "lun"
  | "mar"
  | "mer"
  | "gio"
  | "ven"
  | "sab"
  | "dom"

export const formattedTableKeys: ValidDayTimeTable[] = [
  "lun",
  "mar",
  "mer",
  "gio",
  "ven",
  "sab",
  "dom",
]

export type TableRowEvents = { events: Event[]; overlapNumber: number }

export type ValidTableRow = {
  singleRows: TableRowEvents[]
  maxOverlapNumber: number
  marginTop: number
  collapsedMarginTop: number
}

export type FormattedTable = Record<ValidDayTimeTable, ValidTableRow>

export const getFormattedTable = (events: Event[]): FormattedTable => {
  //order all events by date
  const orderedEvents = events.sort((a, b) => {
    return new Date(a.date_start).getHours() - new Date(b.date_start).getHours()
  })

  const newTable: FormattedTable = {
    lun: {
      singleRows: [],
      maxOverlapNumber: 0,
      marginTop: 0,
      collapsedMarginTop: 0,
    },
    mar: {
      singleRows: [],
      maxOverlapNumber: 0,
      marginTop: 0,
      collapsedMarginTop: 0,
    },
    mer: {
      singleRows: [],
      maxOverlapNumber: 0,
      marginTop: 0,
      collapsedMarginTop: 0,
    },
    gio: {
      singleRows: [],
      maxOverlapNumber: 0,
      marginTop: 0,
      collapsedMarginTop: 0,
    },
    ven: {
      singleRows: [],
      maxOverlapNumber: 0,
      marginTop: 0,
      collapsedMarginTop: 0,
    },
    sab: {
      singleRows: [],
      maxOverlapNumber: 0,
      marginTop: 0,
      collapsedMarginTop: 0,
    },
    dom: {
      singleRows: [],
      maxOverlapNumber: 0,
      marginTop: 0,
      collapsedMarginTop: 0,
    },
  }

  /* const usedColorsCourse: Record<string, string> = {} */

  for (let i = 0; i < orderedEvents.length; i++) {
    const dayOfTheWeek: ValidDayTimeTable = getDayFromEvent(orderedEvents[i])

    // get overlap number
    let overlapNumber = 0

    let overlapNumberFound = false
    //iterate over all previous events in the ordered array
    for (let j = 0; j < i && !overlapNumberFound; j++) {
      if (isSameDay(orderedEvents[j], orderedEvents[i])) {
        //check if ith event overlaps with the preceding j-th events
        if (!isOverlap(orderedEvents[j], orderedEvents[i])) {
          const lecturesAlreadyPlaced = newTable[dayOfTheWeek].singleRows.find(
            val => val.overlapNumber === overlapNumber
          )
          if (lecturesAlreadyPlaced) {
            let isThereSpace = true
            for (
              let m = 0;
              m < lecturesAlreadyPlaced.events.length && isThereSpace;
              m++
            ) {
              if (
                isOverlap(lecturesAlreadyPlaced.events[m], orderedEvents[i])
              ) {
                isThereSpace = false
              }
            }

            if (isThereSpace) {
              //there's space
              overlapNumberFound = true
            }
          } else {
            //found correct row
            overlapNumberFound = true
          }
        } else {
          overlapNumber++
        }
      }
    }

    const relevantMultiRow = newTable[dayOfTheWeek]
    let found = false
    for (let k = 0; k < relevantMultiRow.singleRows.length && !found; k++) {
      if (relevantMultiRow.singleRows[k].overlapNumber === overlapNumber) {
        found = true
        /* 
        let color: string | undefined
        if (usedColorsCourse[orderedEvents[i].title.it]) {
          color = usedColorsCourse[orderedEvents[i].title.it]
        } else {
          color = getRandomLectureColor(usedColorsCourse)
          usedColorsCourse[orderedEvents[i].title.it] = color
        }
 */
        //push event in row
        relevantMultiRow.singleRows[k].events.push({
          ...orderedEvents[i],
          /*  lectureColor: color, */
        })

        if (relevantMultiRow.maxOverlapNumber < overlapNumber) {
          relevantMultiRow.maxOverlapNumber = overlapNumber
        }
      }
    }
    if (!found) {
      /* let color: string | undefined
      if (usedColorsCourse[orderedEvents[i].title.it]) {
        color = usedColorsCourse[orderedEvents[i].title.it]
      } else {
        color = getRandomLectureColor(usedColorsCourse)
        usedColorsCourse[orderedEvents[i].title.it] = color
      } */
      //add new row in multiRow with correct overlapNumber
      relevantMultiRow.singleRows.push({
        events: [{ ...orderedEvents[i] /* , lectureColor: color  */ }],
        overlapNumber: overlapNumber,
      })
      if (relevantMultiRow.maxOverlapNumber < overlapNumber) {
        relevantMultiRow.maxOverlapNumber = overlapNumber
      }
    }
  }

  //TODO: forse è meglio estrarre questa logica in una funzione a parte e togliere marginTop e collapsedMarginTop
  //TODO : dal formattedTable, anche perchè se dobbiamo cambiare la ui poi abbiamo valori obsoleti in memoria...
  //calculate proper margin
  let accumulatedMargin = 0
  let accumulatedMarginCollapsed = 0
  for (let i = 1; i < formattedTableKeys.length; i++) {
    const maxOverlapIth = newTable[formattedTableKeys[i - 1]].maxOverlapNumber
    //TODO : capire i valori giusti da mettere per i margini
    accumulatedMargin +=
      (maxOverlapIth + 1) *
        (LECTURE_HEIGHT_OPEN + 2 * LECTURE_CONTAINER_PADDING) +
      LECTURE_ROW_DISTANCE
    accumulatedMarginCollapsed +=
      (maxOverlapIth + 1) *
        (LECTURE_HEIGHT_COLLAPSED + 2 * LECTURE_CONTAINER_PADDING) +
      LECTURE_ROW_DISTANCE
    newTable[formattedTableKeys[i]].marginTop = accumulatedMargin
    newTable[formattedTableKeys[i]].collapsedMarginTop =
      accumulatedMarginCollapsed
  }

  return newTable
}

export const getDayFromEvent = (event: Event): ValidDayTimeTable => {
  const dateNumber = new Date(event.date_start).getDay()

  return dayMappingObject[dateNumber]
}

export const isSameDay = (a: Event, b: Event) => {
  const dayA = new Date(a.date_start).getDay()
  const dayB = new Date(b.date_start).getDay()
  return dayA === dayB
}

//index of event "first" is less than index of event "second" in the orderedEvents array
export const isOverlap = (first: Event, second: Event) => {
  const startA = new Date(first.date_start).getHours()
  const endA = new Date(first.date_end).getHours()

  const startB = new Date(second.date_start).getHours()

  return startB === startA || (startB > startA && startB < endA)
}

/**
 *
 * helper function used in WeekLine.tsx for getting list of margins for lectures in opened state
 *
 * @param table
 * @returns list of maxOverlapsNumbers
 */
export const getMarginDays = (table: FormattedTable): number[] => {
  const list: number[] = []

  for (let i = 0; i < formattedTableKeys.length; i++) {
    list.push(table[formattedTableKeys[i]].marginTop)
  }

  return list
}

/**
 *
 * helper function used in WeekLine.tsx for getting list of margins for lectures in closed state
 *
 * @param table
 * @returns list of maxOverlapsNumbers
 */
export const getMarginDaysCollapsed = (table: FormattedTable): number[] => {
  const list: number[] = []

  for (let i = 0; i < formattedTableKeys.length; i++) {
    list.push(table[formattedTableKeys[i]].collapsedMarginTop)
  }

  return list
}

/**
 *
 * @param dateStartISO
 * @param dateEndISO
 * @returns the formatted string to show in the bottom sheet
 */
export const getTimeIntervalFormattedString = (
  dateStartISO?: string,
  dateEndISO?: string,
  lan?: string
) => {
  if (!dateStartISO || !dateEndISO) {
    return undefined
  }
  const dateStart = new Date(dateStartISO)
  const dateEnd = new Date(dateEndISO)

  const dayNameObj = dayStringMappingObject[dateStart.getDay()]

  const dayName = lan === "it" ? dayNameObj.it : dayNameObj.en

  const timeStartHours = dateStart.getHours().toString().padStart(2, "0")
  const timeStartMinutes = dateStart.getMinutes().toString().padStart(2, "0")
  const timeEndHours = dateEnd.getHours().toString().padStart(2, "0")
  const timeEndMinutes = dateEnd.getMinutes().toString().padStart(2, "0")

  return `${dayName} ${
    lan === "it" ? "dalle" : "from"
  } ${timeStartHours}:${timeStartMinutes} ${
    lan === "it" ? "alle" : "to"
  } ${timeEndHours}:${timeEndMinutes}`
}

export const getLectureRoomFormattedString = (room?: string, lan?: string) => {
  if (!room) {
    return undefined
  }

  return `${lan === "it" ? "lezione in aula" : "lecture in room"}: ${room}`
}

export const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
const colorList = [
  "#52E8F2",
  "#52F275",
  "#F06876",
  "#F28252",
  "#B50E1E",
  "#DC46F5",
]

const getRandomLectureColor = (subjects: Subjects) => {
  const newColorArray: string[] = [...colorList]

  //remove colors already used
  Object.keys(subjects).forEach(key => {
    const color = subjects[key].color
    if (color) {
      newColorArray.splice(newColorArray.indexOf(color), 1)
    }
  })

  //if there are still colors available
  if (newColorArray.length !== 0) {
    const randomNumber = randomInteger(0, newColorArray.length - 1)
    return newColorArray[randomNumber]
  } else {
    //if there are no colors available
    const randomNumber = randomInteger(0, colorList.length - 1)
    return colorList[randomNumber]
  }
}

const shiftColor = (color?: string) => {
  if (!color) {
    return colorList[0]
  }
  const colorPos = colorList.findIndex(c => c === color)
  return colorList[(colorPos + 1) % colorList.length]
}

/**
 * By storing the busiest week of the semester we can reconstruct the entire timetable.
 */
interface Timetable {
  busiestWeek: Event[]
  //the date it was calculated
  date: Date
  matricola: string
}

export type Subjects = Record<
  string,
  { isShowing: boolean; color?: string; en?: string }
>

//hardcoding day and month of semester start date

//12th September start of first semester
const FIRST_SEMESTER_START_DAY = 12

//month start from 0
const FIRST_SEMESTER_START_MONTH = 8

//20th February start of second semester
const SECOND_SEMESTER_START_DAY = 20

const SECOND_SEMESTER_START_MONTH = 1

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export declare interface TimetableDeducer {
  /**
   * fired when timetable is set
   * */
  on(event: "timetable_retrieved", listener: (loggedIn: boolean) => void): this
}

/**
 * Timetable Deducer, a singleton class for managing the timetable.
 *
 *  - It can be used to retrieve the timetable from the events and store it in the local storage.
 *
 *  Information stored include:
 *  - the busiest week of the semester from which the entire timetable can be reconstructed
 *  - the date it was calculated
 *  - the matricola of the user
 *  - the subjects, their respective colors and if they are visible or not
 *
 *  - The formatted table is calculated every time the page is opened or when a subject change color or visibility.
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class TimetableDeducer extends EventEmitter {
  private timetable: Timetable | undefined

  public formattedTable: FormattedTable | undefined

  public subjects: Subjects = {}

  private _matricola: string

  private _isNowFirstSemester: boolean | undefined

  private _firstSemesterStartDate: Date | undefined

  private _secondSemesterStartDate: Date | undefined

  constructor(matricola: string) {
    super()
    this._matricola = matricola
    void this._readFromStorage()
    this._initializeSemesterDates()
  }

  private _initializeSemesterDates = () => {
    const today = new Date()
    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth()
    if (todayMonth <= 6) {
      this._isNowFirstSemester = false
      //January to July
      this._firstSemesterStartDate = new Date(
        todayYear - 1,
        FIRST_SEMESTER_START_MONTH,
        FIRST_SEMESTER_START_DAY
      )
      this._secondSemesterStartDate = new Date(
        todayYear,
        SECOND_SEMESTER_START_MONTH,
        SECOND_SEMESTER_START_DAY
      )
    } else {
      this._isNowFirstSemester = true
      //August to December
      this._firstSemesterStartDate = new Date(
        todayYear,
        FIRST_SEMESTER_START_MONTH,
        FIRST_SEMESTER_START_DAY
      )
      this._secondSemesterStartDate = new Date(
        todayYear + 1,
        SECOND_SEMESTER_START_MONTH,
        SECOND_SEMESTER_START_DAY
      )
    }
  }

  private _readFromStorage = async () => {
    try {
      const timetableJSON = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + "timetable.json"
      )
      const timetable = JSON.parse(timetableJSON) as Timetable

      const subjectsJSON = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + "subjects.json"
      )
      const subjects = JSON.parse(subjectsJSON) as Subjects

      if (!this._checkNeedCalculating(timetable.date)) {
        this.timetable = timetable
        this.subjects = subjects

        //Initialize formatted table by calculating margins
        this.formattedTable = getFormattedTable(timetable.busiestWeek)

        //apply visibility and colors
        this._applyFiltersFormattedTimetable()

        this.emit("timetable_retrieved")
      } else {
        void this._deduceTimetableFromEvents()
      }
    } catch (err) {
      console.log(err)
      console.log("First time opening timetable page")
      void this._deduceTimetableFromEvents()
    }
  }

  private _writeToStorage = async (timetable: Timetable): Promise<boolean> => {
    const timetableJSON = JSON.stringify(timetable)
    try {
      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + "timetable.json",
        timetableJSON
      )

      return true
    } catch (err) {
      console.log(err)
      console.log("Error storing timetable")
      return false
    }
  }

  private _writeSubjectsToStorage = async (
    subjects: Subjects
  ): Promise<boolean> => {
    const subjectsJSON = JSON.stringify(subjects)
    try {
      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + "subjects.json",
        subjectsJSON
      )

      return true
    } catch (err) {
      console.log(err)
      console.log("Error storing subjects")
      return false
    }
  }

  public updateSubjects = (subjects: Subjects) => {
    this.subjects = subjects

    void this._applyFiltersFormattedTimetable()

    void this._writeSubjectsToStorage(subjects)
  }

  private _applyFiltersFormattedTimetable = () => {
    if (this.timetable) {
      //filter by visibility
      const filteredEvents = this.timetable.busiestWeek.filter(event => {
        return this.subjects[event.title.it].isShowing == true
      })

      this.formattedTable = getFormattedTable(filteredEvents)

      //colorize table
      this._colorizeFormattedTable()

      this.emit("timetable_retrieved")
    }
  }

  private _checkNeedCalculating = (date: Date): boolean => {
    //should not be necessary, initialized in constructor
    if (!this._firstSemesterStartDate || !this._secondSemesterStartDate) {
      return false
    }

    let referenceDate: Date
    if (this._isNowFirstSemester) {
      referenceDate = this._firstSemesterStartDate
    } else {
      referenceDate = this._secondSemesterStartDate
    }
    //for some reason I need to create a new Date from date, otherwise .getTime() breaks
    const lastDateOfCalculation = new Date(date)
    const now = new Date()

    if (
      //reference is in the past with respect to now
      now.getTime() > referenceDate.getTime() &&
      //reference is in the future with respect to last date of caculation
      lastDateOfCalculation.getTime() < referenceDate.getTime()
    ) {
      return true
    }
    return false
  }
  /**
   *
   * This function is responsible for requesting events,
   * calculating the busiest week in the current semester and storing the timetable in the local storage.
   *
   * It is called the first time the timetable page is opened and when semester changes.
   *
   */

  private _deduceTimetableFromEvents = async () => {
    try {
      if (!this._firstSemesterStartDate || !this._secondSemesterStartDate) {
        return
      }

      let startDate: Date
      if (this._isNowFirstSemester) {
        startDate = this._firstSemesterStartDate
      } else {
        startDate = this._secondSemesterStartDate
      }

      const events = await api.events.getEvents({
        matricola: this._matricola ?? "",
        startDate: startDate.toISOString().substring(0, 10),
        nEvents: 200,
      })

      const filteredEvents = events
        .filter(
          event =>
            //11 week range
            new Date(event.date_start).getTime() <=
            new Date(
              new Date(event.date_start).getTime() + 11 * 24 * 60 * 60 * 1000
            ).getTime()
        )
        .filter(e => e.event_type.typeId === EventType.LECTURES) //filter only the lectures)

      const busiestWeek: Event[] = this._calculateBusiestWeek(filteredEvents)

      //calculate all margins
      this.formattedTable = getFormattedTable(busiestWeek)

      const subjects: Subjects = {}

      busiestWeek.forEach(event => {
        if (!subjects[event.title.it]) {
          subjects[event.title.it] = { isShowing: true, en: event.title.en }
        }
      })

      this.subjects = subjects

      //apply just colors
      this._colorizeFormattedTable()

      this.emit("timetable_retrieved")

      //update instance member
      this.timetable = {
        busiestWeek: busiestWeek,
        date: new Date(),
        matricola: this._matricola,
      }

      //update storage
      void this._writeToStorage(this.timetable)

      void this._writeSubjectsToStorage(subjects)
    } catch (err) {
      console.log(err)
    }
  }

  private _calculateBusiestWeek = (events: Event[]): Event[] => {
    const obj: Record<ValidDayTimeTable, Event[]> = {
      lun: [],
      mar: [],
      mer: [],
      gio: [],
      ven: [],
      sab: [],
      dom: [],
    }

    for (let i = 0; i < events.length; i++) {
      const startDateDay = new Date(events[i].date_start).getDay()
      const dayOfTheWeek: ValidDayTimeTable = dayMappingObject[startDateDay]

      //count how many lectures in given day
      const lectures: Event[] = []
      for (
        let j = i;
        j < events.length &&
        new Date(events[j].date_start).getDay() === startDateDay;
        j++
      ) {
        //iterate until date start is different
        lectures.push(events[j])
      }

      if (obj[dayOfTheWeek].length < lectures.length) {
        //update if found that in a specific "Monday", for example, there are more lectures. (i.e: no missing lectures)
        obj[dayOfTheWeek] = lectures
      }

      const counter = lectures.length

      //skip events until next day
      i += counter - 1
    }

    //puts all togheter
    const newArray: Event[] = []
    for (let i = 0; i < formattedTableKeys.length; i++) {
      newArray.push(...obj[formattedTableKeys[i]])
    }
    return newArray
  }

  private _colorizeFormattedTable = () => {
    if (!this.formattedTable) {
      return
    }

    let changed = false

    for (const key of formattedTableKeys) {
      for (let i = 0; i < this.formattedTable[key].singleRows.length; i++) {
        for (
          let j = 0;
          j < this.formattedTable[key].singleRows[i].events.length;
          j++
        ) {
          let color: string | undefined

          //if subject already has a color, use it
          if (
            this.subjects[
              this.formattedTable[key].singleRows[i].events[j].title.it
            ].color
          ) {
            color =
              this.subjects[
                this.formattedTable[key].singleRows[i].events[j].title.it
              ].color
          } else {
            changed = true

            //get new color
            color = getRandomLectureColor(this.subjects)

            this.subjects[
              this.formattedTable[key].singleRows[i].events[j].title.it
            ].color = color
          }

          this.formattedTable[key].singleRows[i].events[j].lectureColor = color
        }
      }
    }

    if (changed) {
      void this._writeSubjectsToStorage(this.subjects)
    }
  }

  public changeColor = (subject?: string): string | undefined => {
    if (!subject) {
      return
    }

    const oldColor = this.subjects[subject].color

    const newColor = oldColor
      ? shiftColor(oldColor)
      : getRandomLectureColor(this.subjects)

    this.subjects[subject].color = newColor

    this._applyFiltersFormattedTimetable()

    void this._writeSubjectsToStorage(this.subjects)

    return newColor
  }

  public refresh = () => {
    void this._deduceTimetableFromEvents()
  }
}
