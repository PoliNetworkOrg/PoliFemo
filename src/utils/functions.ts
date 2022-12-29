/**
 * takes as input a number, let's say "n".
 * Returns the ISO date string of "n" days ago
 */
export function getIsoStringFromDaysPassed(n: number): string {
    //today's date in milliseconds from the beginning of time
    const time = Date.now()

    //milliseconds in n days
    const timeToSubtract = n * 24 * 60 * 60 * 1000

    //n-days-ago's date in milliseconds from the beginning of time
    const newTime = time - timeToSubtract
    //n-days-ago's date
    const newDate = new Date(newTime)

    return newDate.toISOString()
}

/**
 * waits for "ms" milliseconds
 * @param ms milliseconds to wait
 */
export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}
