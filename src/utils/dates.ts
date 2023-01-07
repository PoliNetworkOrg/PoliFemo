/**
 * takes as input a number, let's say "n".
 * Returns the ISO date string of "n" days ago
 */
export function getIsoStringFromDaysPassed(n: number): string {
    //todays'date
    const today = new Date()
    //today's date in milliseconds from the beginning of time
    const time = today.getTime()

    //milliseconds in n days
    const timeToSubtract = n * 24 * 60 * 60 * 1000

    //n-days-ago's date in milliseconds from the beginning of time
    const newTime = time - timeToSubtract
    //n-days-ago's date
    const newDate = new Date(newTime)

    return newDate.toISOString()
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
