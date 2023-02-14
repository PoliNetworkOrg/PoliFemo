import { ValidCrowdStatus } from "components/FreeClass/ClassDetails/CrowdingSection"

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

export function extractTimeLeft(startDate: Date) {
    const deltaMilliseconds = startDate.getTime() - Date.now()
    const hours = Math.floor(deltaMilliseconds / 3.6e6)
    const minutes = Math.floor(
        (deltaMilliseconds - hours * 60 * 60 * 1000) / 60000
    )
    const hoursLeft = hours.toString()
    const minutesLeft = minutes.toString()
    const isPositive = hours >= 0 && minutes >= 0
    return { hoursLeft, minutesLeft, isPositive }
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

