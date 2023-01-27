import { articles } from "./articles"
import { auth } from "./auth"
import { tags } from "./tags"
import { timetable } from "./timetable"
import { user } from "./user"
import { events } from "./event"
export { RetryType, AuthType, RequestOptions } from "./HttpClient"
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
 * Check {@link RequestOptions} for additional request parameters
 * like RetryType, etc...
 */
export const api = {
    articles,
    auth,
    tags,
    timetable,
    user,
    events,
}
