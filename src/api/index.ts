import { articles } from "./collections/articles"
import { auth } from "./collections/auth"
import { events } from "./collections/event"
import { groups } from "./collections/groups"
import { tags } from "./collections/tags"
import { user } from "./collections/user"
import { ApiCollection } from "./useApiCall"
export { RetryType, AuthType, RequestOptions } from "./HttpClient"
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
  tags,
  user,
  events,
  groups,
} satisfies Record<string, ApiCollection>
