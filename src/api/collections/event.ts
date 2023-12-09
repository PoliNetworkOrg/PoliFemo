import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"
import { AuthType, HttpClient, RequestOptions } from "../HttpClient"
import { eventSchema, lectureDetailsSchema } from "api/schemas"

const client = HttpClient.getInstance()

export const events = {
  getEvents(
    params: { matricola: string; startDate: string; nEvents: number },
    options?: RequestOptions
  ) {
    const url = "/agenda/api/me/" + params.matricola + "/events"
    const request = client.callPolimi({
      url,
      method: "GET",
      authType: AuthType.POLIMI,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      params: { start_date: params.startDate, n_events: params.nEvents },
      zodSchema: eventSchema.array(),
      ...options,
    })
    return mapAxiosRequest(request, response => response)
  },

  getLectureDetails(
    params: { matricola: string; eventId: number },
    options?: RequestOptions
  ) {
    const url = `/agenda/api/me/${params.matricola}/lectures/${params.eventId}`
    const request = client.callPolimi({
      url,
      method: "GET",
      authType: AuthType.POLIMI,
      zodSchema: lectureDetailsSchema,
      ...options,
    })
    return mapAxiosRequest(request, response => response.lecture)
  },
} satisfies ApiCollection
