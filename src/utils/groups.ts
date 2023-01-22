import { Group } from "api/groups"

/**
 * return groups filtered by language
 * see {@link Groups} Page
 */
export function filterByLanguage(groups: Group[], language?: string) {
    return groups.filter(group => {
        return group.language === language
    })
}

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
    if ((first === null || first === "?/?") && second !== null) {
        return true
    } else if (second === null || first === null) {
        return false
    }
    const regex = /^\d{4}\/\d{4}$/
    if (regex.test(first) && regex.test(second)) {
        if (parseInt(first.substring(5)) < parseInt(second.substring(5))) {
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
