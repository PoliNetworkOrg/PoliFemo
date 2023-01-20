import { Group } from "api/groups"

/**
 * return groups filtered by language
 * see {@link Groups} Page
 */
export function filterByLanguage(groups: Group[], language: string) {
    return groups.filter(group => {
        return group.language === language
    })
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
