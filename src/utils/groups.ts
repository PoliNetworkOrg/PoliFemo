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
