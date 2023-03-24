/* eslint-disable @typescript-eslint/naming-convention */
import BuildingListJSON from "components/FreeClass/buildingCoords.json"
import { ConstructionType, Occupancies, Room, RoomSimplified } from "api/rooms"
import buildingCoordsJSON from "components/FreeClass/buildingCoords.json"
import {
  HeadquarterItem,
  CampusItem,
  BuildingItem,
} from "components/FreeClass/DefaultList"

export function extractRoom(val: string) {
  if (val.toLowerCase().includes("corridoio")) {
    return val
  }
  //split string on characters "." or " " using Regular Expression
  const arr = val.split(/[.\s]+/)
  if (arr.length >= 2 && containsNumber(val)) {
    //for T.0.1 in building 13 -----> 13.T.0.1, idem for L.0.1
    if (containsLOrT(val)) {
      return arr.join(".")
    }
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

function containsLOrT(val: string) {
  const regExp = /(L\.|T\.)/
  return regExp.test(val)
}

export function extractTimeLeft(
  startDate?: Date,
  targetDate?: Date,
  searchDate?: Date
) {
  if (!targetDate || !startDate) {
    return { hoursLeft: undefined, minutesLeft: undefined }
  }
  if (
    searchDate &&
    searchDate?.getTime() > startDate.getTime() &&
    searchDate?.getTime() < targetDate.getTime()
  ) {
    const deltaMilliseconds = targetDate.getTime() - searchDate.getTime()
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
  } else {
    const deltaMilliseconds = targetDate.getTime() - startDate.getTime()
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

export function getBuildingCoords(campus?: CampusItem, buildingName?: string) {
  if (!campus || !buildingName) {
    return undefined
  }
  for (const element of BuildingListJSON) {
    if (element.acronym === campus.acronym) {
      for (const c of element.campus) {
        if (compareCampusNames(c.name, campus.name)) {
          for (const b of c.buildings) {
            if (b.name === buildingName) {
              return b.coords
            }
          }
        }
      }
    }
  }
}

// A slower version of getBuildingCoords but works without knowing campus
export function getBuildingCoordsWithoutCampus(
  acronyms?: ValidAcronym[],
  buildingName?: string
) {
  if (!buildingName) {
    return undefined
  }

  const acronymList = acronyms ?? [
    "MIA",
    "MIB",
    "MIA",
    "MIB",
    "CRG",
    "LCF",
    "PCL",
    "MNI",
  ]

  for (const element of BuildingListJSON) {
    for (const acr of acronymList) {
      if (element.acronym === acr) {
        for (const c of element.campus) {
          for (const b of c.buildings) {
            if (b.name === buildingName) {
              return b.coords
            }
          }
        }
      }
    }
  }
}

export function getBuildingInfo(
  acronym: ValidAcronym,
  buildingName: string
): BuildingItem | undefined {
  for (const h of BuildingListJSON) {
    if (h.acronym == acronym) {
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

export const isCampusCorrect = (campus: CampusItem, room: Room) => {
  for (const h of buildingCoordsJSON) {
    if (h.acronym === campus.acronym) {
      for (const c of h.campus) {
        if (c.name.toString() === campus.name.toString()) {
          for (const b of c.buildings) {
            if (room.building === b.name) {
              return true
            }
          }
        }
      }
    }
  }
  return false
}

export function addHours(dateStart: Date, hours: number) {
  const tempDate = new Date(dateStart.getTime())
  tempDate.setHours(tempDate.getHours() + hours)
  return tempDate
}

export function formatBuildingName(name: string): [string, string] {
  const newName = name
    .replace("Edificio", "Ed.")
    .replace("Padiglione", "Pad.")
    .replace("Palazzina", "Pal.")
    .split(" ")
  return [newName[0], newName[1]]
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

export const findTimeLeft = (occupancies: Occupancies, date: Date) => {
  const { startDate, endDate } = getStartEndDate(date, occupancies)
  const { hoursLeft, minutesLeft } = extractTimeLeft(startDate, endDate, date)
  return { hoursLeft, minutesLeft }
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

export const isRoomFree = (
  room: Room | RoomSimplified,
  date: Date,
  mustBeFreeNow?: boolean
) => {
  const limitDate = new Date(date)

  limitDate.setHours(20, 0, 0, 0)
  if (date.getTime() > limitDate.getTime()) {
    return false
  }
  if (mustBeFreeNow) {
    limitDate.setHours(8, 0, 0, 0)
    if (date.getTime() < limitDate.getTime()) {
      return false
    }
  }

  const occupancies = room.occupancies
  let windowFound = false

  const minutesDate = date.getMinutes()
  const hoursDate = date.getHours()
  const times = Object.keys(occupancies)

  if (times.length === 0) {
    //something went terribly wrong (?)
    return false
  } else if (times.length === 1) {
    const time = times[0]
    const hourStr = time.substring(0, 2)
    const minutesStr = time.substring(3)
    const isFree = occupancies[`${hourStr}:${minutesStr}`].status === "FREE"
    return isFree
  }
  if (!mustBeFreeNow) {
    times.map(time => {
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
  } else {
    const len = times.length
    for (let i = 0; i < len - 1; i++) {
      const prevTime = times[i]
      const prevTimeHour = prevTime.substring(0, 2)
      const prevTimeMin = prevTime.substring(3)
      const prevTimeMinNum = parseInt(prevTimeMin)
      const prevTimeHourNum = parseInt(prevTimeHour)
      const isFreePrevTime =
        occupancies[`${prevTimeHour}:${prevTimeMin}`].status === "FREE"
      const succTime = times[i + 1]
      const succTimeHour = succTime.substring(0, 2)
      const succTimeMin = succTime.substring(3)
      const succTimeMinNum = parseInt(succTimeMin)
      const succTimeHourNum = parseInt(succTimeHour)
      const isFreeSuccTime =
        occupancies[`${succTimeHour}:${succTimeMin}`].status === "FREE"
      if (
        isFreePrevTime &&
        !isFreeSuccTime &&
        (hoursDate > prevTimeHourNum ||
          (hoursDate === prevTimeHourNum && minutesDate >= prevTimeMinNum)) &&
        (hoursDate < succTimeHourNum ||
          (hoursDate === succTimeHourNum && minutesDate <= succTimeMinNum))
      ) {
        return true
      }
    }
    const lastTime = times[len - 1]
    const lastTimeHour = lastTime.substring(0, 2)
    const lastTimeMin = lastTime.substring(3)
    const lastTimeMinNum = parseInt(lastTimeMin)
    const lastTimeHourNum = parseInt(lastTimeHour)
    const isFreeLastTime =
      occupancies[`${lastTimeHour}:${lastTimeMin}`].status === "FREE"
    if (
      isFreeLastTime &&
      (hoursDate > lastTimeHourNum ||
        (hoursDate === lastTimeHourNum && minutesDate >= lastTimeMinNum))
    ) {
      return true
    }
    return false
  }
}

export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const formatDate = (date: Date) => {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

export type ValidAcronym = "MIA" | "MIB" | "CRG" | "LCF" | "PCL" | "MNI"

export type GlobalRoomListInterface = {
  expireAt?: string
  searchDate?: string
} & Record<ValidAcronym, Room[]>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasAcronymProp(obj: any): obj is HeadquarterItem {
  return "acronym" in obj
}
