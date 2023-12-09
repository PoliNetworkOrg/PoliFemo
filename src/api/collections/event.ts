import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"
import { AuthType, HttpClient, RequestOptions } from "../HttpClient"
import { EventType } from "utils/events"

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
    typeId: EventType
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
  //used by Timetable to store color
  lectureColor?: string
}

export interface RemoteLink {
  url: string
  link_description: {
    it: string
    en: string
  }
}

export interface Lecture {
  event_id: number
  room_id: number
  date_start: string
  date_end: string
  class_code: number
  teaching_description: {
    it: string
    en: string
  }
  lecturer: string
  lecture_type: string
  event_type: {
    typeId: number
    type_dn: {
      it: string
      en: string
    }
  }
  calendar: {
    calendar_id: number
    calendar_dn: {
      it: string
      en: string
    }
  }
  room: {
    room_id: number
    campus: string
    address: string
    floor: string
    building: string
    type: string
    acronym_dn: string
    coordinates: {
      latitude: number
      longitude: number
    }
    csi_id: string
    csi_parent_id: string
    classroom_id: number
    room_dn: string
  }
  remote_links: RemoteLink[]
}

export interface LectureDetails {
  lecture: Lecture
  personal_event: Event
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

  getLectureDetails(
    params: { matricola: string; eventId: number },
    options?: RequestOptions
  ) {
    const url = `/agenda/api/me/${params.matricola}/lectures/${params.eventId}`
    const request = client.callPolimi<LectureDetails>({
      url,
      method: "GET",
      authType: AuthType.POLIMI,
      ...options,
    })
    return mapAxiosRequest(request, response => response.lecture)
  },
} satisfies ApiCollection
