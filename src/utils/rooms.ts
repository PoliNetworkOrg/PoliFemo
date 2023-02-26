import BuildingListJSON from "components/FreeClass/buildingCoords.json"
import { CampusItem } from "pages/FreeClass/CampusChoice"
import { Occupancies } from "api/rooms"

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

export function extractTimeLeft(now: Date, targetDate?: Date) {
  if (!targetDate) {
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
 * Return the correct end date in which the room is free given a record of occcupancies
 *
 * return undefined in case of errors
 *
 */
export function getEndDate(startDate: Date, occupancies?: Occupancies) {
  let time

  if (occupancies !== undefined) {
    try {
      time = Object.keys(occupancies).find(time => {
        const hour = parseInt(time.substring(0, 2))
        const minutes = parseInt(time.substring(3))
        return occupancies[`${hour}:${minutes}`] === "OCCUPIED"
      })
    } catch (err) {
      console.log(err)
      return undefined
    }
  }
  if (time === undefined) {
    const endDate = new Date(startDate)
    endDate.setHours(20, 0, 0, 0)
    return endDate
  } else {
    try {
      const hour = parseInt(time.substring(0, 2))
      const minutes = parseInt(time.substring(3))
      const endDate = new Date(startDate)
      endDate.setHours(hour, minutes, 0, 0)
      return endDate
    } catch (err) {
      console.log(err)
      return undefined
    }
  }
}

export function getBuildingCoords(campus: CampusItem, buildingName: string[]) {
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
    .split(" ")
}
