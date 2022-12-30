import { articles } from "./articles"
import { auth } from "./auth"
import { tags } from "./tags"
import { timetable } from "./timetable"
export * from "./httpClient"

/**
 * This object groups together all collections of endpoints.
 *
 * To make a request:
 *
 * ```ts
 *       api.tags.get({retryType : RetryType.RETRY_N_TIMES, maxRetries : 5})
 *           .then(response => {
 *               const tags: Tag[] = response
 *               //do something
 *           })
 *           .catch(err => console.log(err))
 * ```
 *
 */
export const api = {
    articles,
    auth,
    tags,
    timetable,
}
