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

function extractRoom(val: string) {
    const len = val.length
    const hasNumbers = containsNumber(val)
    if (!hasNumbers) {
        return { room: val, isOnlyText: true }
    } else {
        val = val.trimEnd()

        let separatorIndex: number | undefined = undefined

        let dotsFound = 0
        for (let n = len - 1; n > 0 && separatorIndex === undefined; n--) {
            if (val[n] === "." || val[n] === " ") {
                dotsFound++
            }
            if (dotsFound === 2) {
                separatorIndex = n
            }
        }
        if (separatorIndex) {
            return {
                room: val.substring(separatorIndex + 1, len),
                isOnlyText: false,
            }
        } else {
            //something went wrong, display all string ?
            return { room: val, isOnlyText: true }
        }
    }
    return
}

function extractBuilding(val: string) {
    const len = val.length
    let separatorIndex: number | undefined = undefined
    for (let n = len; n > 0 && separatorIndex === undefined; n--) {
        if (val === " ") {
            separatorIndex = n
        }
    }
    if (separatorIndex) {
        return { building: val.substring(separatorIndex + 1, len) }
    } else {
        //something went wrong, display only room
        return { building: undefined }
    }
}

function containsNumber(val: string) {
    // if has digits
    const regExp = /\d/g
    return regExp.test(val)
}
