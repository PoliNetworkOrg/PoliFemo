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
    // return newDate.toISOString()
}
