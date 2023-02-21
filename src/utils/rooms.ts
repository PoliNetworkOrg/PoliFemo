/* eslint-disable @typescript-eslint/naming-convention */
import { ValidCrowdStatus } from "components/FreeClass/ClassDetails/CrowdingSection"
import BuildingListJSON from "components/FreeClass/buildingCoords.json"
import { CampusItem } from "pages/FreeClass/CampusChoice"

export function extractRoom(val: string) {
  const arr = val.split(".")
  if (arr.length > 2) {
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

/* function containsNumber(val: string) {
    // if has digits
    const regExp = /\d/g
    return regExp.test(val)
} */

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

export function getCrowdStatus(pos: number, width: number): ValidCrowdStatus {
  if (pos < 0) {
    pos = 0
  }

  const radius = 14
  const percentage = (pos + radius) / (width + 2 * radius)
  if (percentage < 0.2) {
    return 1
  } else if (percentage < 0.4) {
    return 2
  } else if (percentage < 0.6) {
    return 3
  } else if (percentage < 0.8) {
    return 4
  } else {
    return 5
  }
}

/**
 * Return the correct end date in which the room is free given a record of occcupancies
 *
 * return undefined in case of errors
 *
 */
export function getEndDate(
  startDate: Date,
  occupancies?: Record<string, "FREE" | "OCCUPIED">
) {
  let time

  if (occupancies !== undefined) {
    time = Object.keys(occupancies).find(
      time => occupancies[time] === "OCCUPIED"
    )
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

export function getBuildingCoords(campus: CampusItem, buildingName: string) {
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
