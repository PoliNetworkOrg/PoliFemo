/**
 * @param date reference date
 * @param n number
 *
 * @returns the date of "n" days before the reference date
 */
export function getDateFromDaysBefore(date: Date, n: number): Date {
  //today's date in milliseconds from the beginning of time
  const time = date.getTime()

  //milliseconds in n days
  const timeToSubtract = n * 24 * 60 * 60 * 1000

  //n-days-ago's date in milliseconds from the beginning of time
  const newTime = time - timeToSubtract
  //n-days-ago's date
  const newDate = new Date(newTime)

  return newDate
}

/**
 * waits for "ms" milliseconds
 * @param ms milliseconds to wait
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * @param str a word or a phrase
 * @param notCapitalize do not capitalize the words that have a length lower than this value
 * @default 0
 *
 * @returns the capaitalized string
 */
export function capitalize(str: string, notCapitalize = 0): string {
  const arr = str.split(" ")
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length <= notCapitalize) {
      arr[i] = arr[i].toLowerCase()
    } else {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase()
    }
  }
  return arr.join(" ")
}
