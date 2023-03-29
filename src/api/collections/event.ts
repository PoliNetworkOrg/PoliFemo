import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"
import { AuthType, HttpClient, RequestOptions } from "../HttpClient"

/* eslint-disable @typescript-eslint/naming-convention */
export interface Event {
  event_id: number
  date_start: string
  date_end: string
  show_agenda: boolean
  matricola?: string
  title: {
    it: string
    en: string
  }
  event_type: {
    typeId: number
    type_dn: {
      it: string
      en: string
    }
  }
  event_subtype?: string
  calendar: {
    calendar_id: number
    calendar_dn: {
      it: string
      en: string
    }
  }
  room?: {
    room_id: number
    acronym_dn: string
    classroom_id: number
    room_dn: string
  }
}

const client = HttpClient.getInstance()

export const events = {
  getEvents(
    params: { matricola: string; startDate: string; nEvents: number },
    options?: RequestOptions
  ) {
    const url = "/agenda/api/me/" + params.matricola + "/events"
    const request = client.callPolimi<Event[]>({
      url,
      method: "GET",
      authType: AuthType.POLIMI,
      params: { start_date: params.startDate, n_events: params.nEvents },
      ...options,
    })
    return mapAxiosRequest(request, response => response)
  },
} satisfies ApiCollection
