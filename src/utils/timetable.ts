/* eslint-disable @typescript-eslint/naming-convention */
import { Event } from "api/collections/event"

/**
 * A more systematic approach for managing margins, change here, change everywhere.
 *
 */

export const LECTURE_WIDTH = 64

export const LECTURE_HEIGHT_OPEN = 60

export const LECTURE_HEIGHT_COLLAPSED = 17

//space between a one-hour slot
export const TIME_SLOT = LECTURE_WIDTH / 2

//nudging times slightly to the right
export const CORRECTION_TIMELINE_FACTOR = 0.9

//padding around lectures
export const LECTURE_CONTAINER_PADDING = 4

//space between multi-rows
export const LECTURE_ROW_DISTANCE = 16

const dayMappingObject: Record<number, ValidDayTimeTable> = {
  1: "lun",
  2: "mar",
  3: "mer",
  4: "gio",
  5: "ven",
  6: "sab",
  0: "dom",
}

const dayStringMappingObject: Record<number, string> = {
  1: "Lunedì",
  2: "Martedì",
  3: "Mercoledì",
  4: "Giovedì",
  5: "Venerdì",
  6: "Sabato",
  0: "Domenica",
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
        //push event in row
        relevantMultiRow.singleRows[k].events.push(orderedEvents[i])

        if (relevantMultiRow.maxOverlapNumber < overlapNumber) {
          relevantMultiRow.maxOverlapNumber = overlapNumber
        }
      }
    }
    if (!found) {
      //add new row in multiRow with correct overlapNumber
      relevantMultiRow.singleRows.push({
        events: [orderedEvents[i]],
        overlapNumber: overlapNumber,
      })
      if (relevantMultiRow.maxOverlapNumber < overlapNumber) {
        relevantMultiRow.maxOverlapNumber = overlapNumber
      }
    }
  }

  //TODO: forse è meglio estrarre questa logica in una funzione a parte e togliere marginTop e collapsedMarginTop
  //TODO : dal formattedTable
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
  dateEndISO?: string
) => {
  if (!dateStartISO || !dateEndISO) {
    return undefined
  }
  const dateStart = new Date(dateStartISO)
  const dateEnd = new Date(dateEndISO)

  const dayName = dayStringMappingObject[dateStart.getDay()]

  const timeStartHours = dateStart.getHours().toString().padStart(2, "0")
  const timeStartMinutes = dateStart.getMinutes().toString().padStart(2, "0")
  const timeEndHours = dateEnd.getHours().toString().padStart(2, "0")
  const timeEndMinutes = dateEnd.getMinutes().toString().padStart(2, "0")

  return `${dayName} dalle ${timeStartHours}:${timeStartMinutes} alle ${timeEndHours}:${timeEndMinutes}`
}

export const getLectureRoomFormattedString = (room?: string) => {
  if (!room) {
    return undefined
  }

  return `lezione in aula: ${room}`
}
