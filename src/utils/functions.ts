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
 * given a `Date` object (NON-ISO), returns the destructured Date
 * ready for use of {@link DateTimePicker}
 */
export function destructureDate(date: Date) {
  const year = date.getFullYear().toString().substring(2, 4) //only last two digits
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const hour = date.getHours().toString().padStart(2, "0")
  const minute = date.getMinutes().toString().padStart(2, "0")
  return { year, month, day, hour, minute }
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
