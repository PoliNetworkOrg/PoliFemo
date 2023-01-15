import { MockedGroup } from "api/groups"

/**
 * return groups filtered by language
 * see {@link Groups} Page
 */
export function filterByLanguage(groups: MockedGroup[], language: string) {
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
