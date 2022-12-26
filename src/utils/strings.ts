/**
 * @param str a word or a phrase
 * @param notCapitalize do not capitalize the words that have a length lower than this value
 * @default 0
 *
 * @returns the capaitalized string
 */
export function capitalize(str: string, notCapitalize = 0): string {
    const arr = str.split(" ")
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].length <= notCapitalize) {
            arr[i] = arr[i].toLowerCase()
        } else {
            arr[i] =
                arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase()
        }
    }
    return arr.join(" ")
}
