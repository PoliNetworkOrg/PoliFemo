import { Group } from "api/groups"

/**
 * return groups ordered by most recent year using a bubble sort algorithm
 * see {@link Groups} Page
 */
export function orderByMostRecentYear(groups: Group[]) {
    let hasChanged: boolean
    try {
        do {
            hasChanged = false
            for (let n = 0; n < groups.length - 1; n++) {
                if (
                    compareBiYear(groups[n].year, groups[n + 1].year) === true
                ) {
                    //swap
                    const temp = groups[n]
                    groups[n] = groups[n + 1]
                    groups[n + 1] = temp
                    hasChanged = true
                }
            }
        } while (hasChanged === true)
    } catch (error) {
        console.log(error)
    }
    return groups
}

function compareBiYear(first: string | null, second: string | null) {
    //apparently null != undefined :( code breaks if I use undefined instead of null
    if ((first === "?/?" || first === null) && second !== null) {
        return true
    } else if (second === null || first === null) {
        return false
    }
    //standard year format "2021/2022"
    const regexStandard = /^\d{4}\/\d{4}$/
    //for inconsistencies in the db ex "2021/22"
    const regexNonStandard = /^\d{4}\/\d{2}$/
    if (
        (regexStandard.test(first) && regexStandard.test(second)) ||
        (regexNonStandard.test(first) && regexNonStandard.test(second))
    ) {
        if (parseInt(first.substring(5)) < parseInt(second.substring(5))) {
            return true
        }
    } else if (regexNonStandard.test(first) && regexStandard.test(second)) {
        if (parseInt(first.substring(5)) < parseInt(second.substring(7))) {
            return true
        }
    } else if (regexStandard.test(first) && regexNonStandard.test(second)) {
        if (parseInt(first.substring(7)) < parseInt(second.substring(5))) {
            return true
        }
    }
    return false
}

export type ValidModalType = "year" | "course" | "type" | "platform"

export const getNameFromMode = (mode: ValidModalType) => {
    if (mode === "year") {
        return "Anno"
    } else if (mode === "course") {
        return "Corso"
    } else if (mode === "platform") {
        return "Piattaforma"
    } else {
        return "Tipo"
    }
}

export function createGroupLink(idLink: string, platform: string) {
    if (platform === "TG") {
        return `https://t.me/joinchat/${idLink}`
    } else if (platform === "WA") {
        return `https://chat.whatsapp.com/${idLink}`
    } else {
        return `https://www.facebook.com/groups/${idLink}`
    }
}

export function msPassedBetween(start: Date | undefined, end: Date) {
    if (start === undefined) {
        return undefined
    }
    return end.getTime() - start.getTime()
}
