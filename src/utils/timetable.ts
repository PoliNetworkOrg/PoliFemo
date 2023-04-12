/* eslint-disable @typescript-eslint/naming-convention */
import { Event } from "api/collections/event"

const dayMappingObject: Record<number, ValidDayTimeTable> = {
  1: "lun",
  2: "mar",
  3: "mer",
  4: "gio",
  5: "ven",
  6: "sab",
  0: "dom",
}

export type ValidDayTimeTable =
  | "lun"
  | "mar"
  | "mer"
  | "gio"
  | "ven"
  | "sab"
  | "dom"

export const FormattedTableKeys: ValidDayTimeTable[] = [
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
}

export type FormattedTable = Record<ValidDayTimeTable, ValidTableRow>

export const getFormattedTable = (events: Event[]): FormattedTable => {
  //order all events by date
  const orderedEvents = events.sort((a, b) => {
    return new Date(a.date_start).getHours() - new Date(b.date_start).getHours()
  })

  const weekSlot = 135 // 120(space between) + 15(space occupied by digit)

  const newTable: FormattedTable = {
    lun: { singleRows: [], maxOverlapNumber: 0, marginTop: 0 * weekSlot },
    mar: { singleRows: [], maxOverlapNumber: 0, marginTop: 1 * weekSlot },
    mer: { singleRows: [], maxOverlapNumber: 0, marginTop: 2 * weekSlot },
    gio: { singleRows: [], maxOverlapNumber: 0, marginTop: 3 * weekSlot },
    ven: { singleRows: [], maxOverlapNumber: 0, marginTop: 4 * weekSlot },
    sab: { singleRows: [], maxOverlapNumber: 0, marginTop: 5 * weekSlot },
    dom: { singleRows: [], maxOverlapNumber: 0, marginTop: 6 * weekSlot },
  }

  for (let i = 0; i < orderedEvents.length; i++) {
    const dayOfTheWeek: ValidDayTimeTable = getDay(orderedEvents[i])

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
  return newTable
}

export const getDay = (event: Event): ValidDayTimeTable => {
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
