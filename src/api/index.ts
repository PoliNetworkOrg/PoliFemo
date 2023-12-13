import { articles } from "./collections/articles"
import { auth } from "./collections/auth"
import { events } from "./collections/event"
import { gradingbook } from "./collections/gradingbook"
import { groups } from "./collections/groups"
import { rooms } from "./collections/rooms"
import { user } from "./collections/user"
import { ApiCollection } from "./useApiCall"
export { AuthType, RequestOptions, RetryType } from "./HttpClient"

/**
 * This object groups together all collections of endpoints.
 *
 * To make a request:
 *
 * ```ts
 *       api.tags.getTags({retryType : RetryType.RETRY_N_TIMES, maxRetries : 5})
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
  events,
  groups,
  rooms,
  user,
  gradingbook,
} satisfies Record<string, ApiCollection>
