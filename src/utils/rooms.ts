/**
 * BL.27.04 --> {"27.04" , false}
 *
 * "F.LLI CASTIGLIONI" ---> {"F.LLI CASTIGLIONI", true}
 *
 * B8 0.3 ---> {"0.3" , false}
 *
 * there are some pathological cases, for example:
 *
 * "ATRIO P.T. - ED. BL.27"
 * "CORRIDOIO SX 1� P. - ED. BL.27"
 * B8 0.10 (EX B8.0.8)
 *
 * what should I show?
 *
 * probably I need to find another way, maybe ask aliases from backend?
 */

export function extractRoom(val: string) {
    const arr = val.split(".")
    if (arr.length > 2) {
        return arr.slice(1).join(".")
    } else {
        return undefined
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
