/* eslint-disable @typescript-eslint/naming-convention */
import BuildingListJSON from "components/FreeClass/buildingCoords.json"
import { CampusItem } from "pages/FreeClass/CampusChoice"
import { ConstructionType, Occupancies, Room, RoomSimplified } from "api/rooms"
import { HeadquarterItem } from "pages/FreeClass/HeadquarterChoice"
import { BuildingItem } from "pages/FreeClass/BuildingChoice"

export function extractRoom(val: string) {
  //split string on characters "." or " " using Regular Expression
  const arr = val.split(/[.\s]+/)
  if (arr.length >= 2 && containsNumber(val)) {
    return arr.slice(1).join(".")
  } else {
    return val
  }
}

export function extractBuilding(val: string) {
  const arr = val.split(" ")
  if (arr.length === 2) {
    return arr[1]
  }
  return undefined
}

function containsNumber(val: string) {
  // if has digits
  const regExp = /\d/g
  return regExp.test(val)
}

export function extractTimeLeft(now?: Date, targetDate?: Date) {
  if (!targetDate || !now) {
    return { hoursLeft: undefined, minutesLeft: undefined }
  }
  const deltaMilliseconds = targetDate.getTime() - now.getTime()
  if (deltaMilliseconds <= 0) {
    return { hoursLeft: undefined, minutesLeft: undefined }
  }
  const hours = Math.floor(deltaMilliseconds / 3.6e6)
  const minutes = Math.floor(
    (deltaMilliseconds - hours * 60 * 60 * 1000) / 60000
  )
  const hoursLeft = hours.toString()
  const minutesLeft = minutes.toString()
  return {
    hoursLeft: hoursLeft,
    minutesLeft: minutesLeft,
  }
}

/**
 * @param pos slider current pos
 * @param width slider max width
 * @returns a float number from 1 to 5
 */
export function getCrowdStatus(pos: number, width: number): number {
  if (pos < 0) {
    return 1
  }
  const percentage = pos / width

  return 1 + percentage * 4
}

/**
 * Return the correct start and end date in which the room is free given a record of occcupancies
 *
 * return undefined in case the endDate cannot be calculated, for example the user is searching
 * free rooms two days ago, or room is not free from now on.
 *
 */
export function getStartEndDate(searchDate: Date, occupancies: Occupancies) {
  if (wasYesterdayRearward(searchDate)) {
    return { startDate: undefined, endDate: undefined }
  }

  const minutesSearch = searchDate.getMinutes()
  const hoursSearch = searchDate.getHours()

  let startTime: string | undefined
  let endTime: string | undefined
  //get time window that encloses now, if not returns next window
  try {
    Object.keys(occupancies).forEach(time => {
      const hourStr = time.substring(0, 2)
      const minutesStr = time.substring(3)
      const hour = parseInt(hourStr)
      const minutes = parseInt(minutesStr)
      const isFree = occupancies[`${hourStr}:${minutesStr}`].status === "FREE"
      if (
        isFree &&
        (hour < hoursSearch ||
          (hour === hoursSearch && minutes < minutesSearch))
      ) {
        //FREE and before
        startTime = time
      } else if (isFree) {
        //FREE and after, if startTime was already found do nothing
        if (!startTime) {
          startTime = time
        }
      } else if (
        !isFree &&
        (hour > hoursSearch ||
          (hour === hoursSearch && minutes > minutesSearch))
      ) {
        //OCCUPIED and after, update if not present
        if (!endTime) {
          endTime = time
        }
      } else if (
        !isFree &&
        (hour < hoursSearch ||
          (hour === hoursSearch && minutes <= minutesSearch))
      ) {
        //OCCUPIED and before, reset both
        startTime = undefined
        endTime = undefined
      }
    })
  } catch (err) {
    console.log(err)
  }
  if (startTime) {
    const hourStart = parseInt(startTime.substring(0, 2))
    const minutesStart = parseInt(startTime.substring(3))
    const startDate = new Date(searchDate)
    startDate.setHours(hourStart, minutesStart, 0, 0)
    const endDate = new Date(searchDate)
    if (endTime) {
      const hourEnd = parseInt(endTime.substring(0, 2))
      const minutesEnd = parseInt(endTime.substring(3))
      endDate.setHours(hourEnd, minutesEnd, 0, 0)
    } else {
      endDate.setHours(20, 0, 0, 0)
    }
    return { startDate, endDate }
  } else {
    //room is not free or something went wrong

    return { startDate: undefined, endDate: undefined }
  }
}

/**
 *
 * @param date
 * @returns true if date was yesterday or the day before yesterday etc...
 */
const wasYesterdayRearward = (date: Date) => {
  const nowAtMidNight = new Date()

  nowAtMidNight.setHours(24, 0, 0, 0)
  const dateAtMidNight = new Date(date)

  dateAtMidNight.setHours(24, 0, 0, 0)
  if (dateAtMidNight.getTime() - nowAtMidNight.getTime() < 0) {
    return true
  }
  return false
}

export function getBuildingCoords(
  campus?: CampusItem,
  buildingName?: string[]
) {
  if (!campus || !buildingName) {
    return undefined
  }
  const newBuildingName: string =
    buildingName[0].replace("Ed.", "Edificio ") + buildingName[1]
  for (const element of BuildingListJSON) {
    if (element.acronym === campus.acronym) {
      for (const c of element.campus) {
        if (compareCampusNames(c.name, campus.name)) {
          for (const b of c.buildings) {
            if (b.name === newBuildingName) {
              return b.coords
            }
          }
        }
      }
    }
  }
}

export function getBuildingInfo(
  headquarter: HeadquarterItem,
  buildingName: string
): BuildingItem | undefined {
  for (const h of BuildingListJSON) {
    if (h.acronym === headquarter.acronym) {
      for (const c of h.campus) {
        for (const b of c.buildings) {
          if (b.name === buildingName) {
            return {
              type: ConstructionType.BUILDING,
              name: formatBuildingName(buildingName),
              campus: {
                type: ConstructionType.CAMPUS,
                name: c.name,
                acronym: h.acronym,
                latitude: c.latitude,
                longitude: c.longitude,
              },
              latitude: b.coords.latitude,
              longitude: b.coords.longitude,
              freeRoomList: [],
              allRoomList: [],
            }
          }
        }
      }
    }
  }
  return undefined
}

const compareCampusNames = (c1: string[], c2: string[]) => {
  if (c1.length === c2.length) {
    if (c1.length > 1) {
      if (c1[0] === c2[0] && c1[1] === c2[1]) {
        return true
      } else {
        return false
      }
    } else {
      if (c1[0] === c2[0]) {
        return true
      } else {
        return false
      }
    }
  } else {
    return false
  }
}

export function addHours(dateStart: Date, hours: number) {
  const tempDate = new Date(dateStart.getTime())
  tempDate.setHours(tempDate.getHours() + hours)
  return tempDate
}

export function formatBuildingName(name: string) {
  return name
    .replace("Edificio", "Ed.")
    .replace("Padiglione", "Pad.")
    .replace("Palazzina", "Pal.")
    .split(" ")
}

export const getSearchEndDate = (searchDate: Date) => {
  const newDate = new Date(searchDate)
  newDate.setHours(20, 0, 0, 0)
  return newDate
}

export const getSearchStartDate = (searchDate: Date) => {
  const newDate = new Date(searchDate)
  newDate.setHours(8, 0, 0, 0)
  return newDate
}

export const getExpirationDateRooms = (cacheControl?: string) => {
  if (!cacheControl) {
    return undefined
  }
  const maxAgeString = cacheControl.split("max-age=")
  let seconds
  if (maxAgeString.length === 2) {
    seconds = parseInt(maxAgeString[1], 10)
    const now = new Date()
    const newDate = new Date(now.getTime() + seconds * 1000)
    return newDate
  }
  return undefined
}

export const isRoomFree = (room: Room | RoomSimplified, date: Date) => {
  const limitDate = new Date(date)
  limitDate.setHours(20, 0, 0, 0)
  if (date.getTime() > limitDate.getTime()) {
    return false
  }

  const occupancies = room.occupancies
  let windowFound = false

  const minutesDate = date.getMinutes()
  const hoursDate = date.getHours()
  Object.keys(occupancies).map(time => {
    const hourStr = time.substring(0, 2)
    const minutesStr = time.substring(3)
    const hour = parseInt(hourStr)
    const minutes = parseInt(minutesStr)

    const isFree = occupancies[`${hourStr}:${minutesStr}`].status === "FREE"
    if (
      isFree &&
      (hour < hoursDate || (hour === hoursDate && minutes < minutesDate))
    ) {
      //FREE and before
      windowFound = true
    } else if (isFree) {
      //FREE and after
      windowFound = true
    } else if (
      !isFree &&
      (hour < hoursDate || (hour === hoursDate && minutes <= minutesDate))
    ) {
      windowFound = false
    }
  })

  return windowFound
}

export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export type ValidAcronym =
  | "MIA"
  | "MIB"
  | "CRG"
  | "LCF"
  | "PCL"
  | "MNI"
  | "MIC"
  | "MID"
  | "COE"

export interface GlobalRoomListInterface {
  MIA: { rooms: Room[]; expireAt?: string; searchDate?: string }
  MIB: { rooms: Room[]; expireAt?: string; searchDate?: string }
  CRG: { rooms: Room[]; expireAt?: string; searchDate?: string }
  LCF: { rooms: Room[]; expireAt?: string; searchDate?: string }
  PCL: { rooms: Room[]; expireAt?: string; searchDate?: string }
  MNI: { rooms: Room[]; expireAt?: string; searchDate?: string }
  MIC: { rooms: Room[]; expireAt?: string; searchDate?: string }
  MID: { rooms: Room[]; expireAt?: string; searchDate?: string }
  COE: { rooms: Room[]; expireAt?: string; searchDate?: string }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasAcronymProp(obj: any): obj is HeadquarterItem {
  return "acronym" in obj
}
