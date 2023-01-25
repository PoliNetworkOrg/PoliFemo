import { AuthType, HttpClient, RequestOptions } from "./HttpClient"

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
    async getEvents(
        matricola: string,
        start_date: string,
        n_events: number,
        options?: RequestOptions
    ) {
        const url = "/agenda/api/me/" + matricola + "/events"
        const response = await client.polimiInstance.get<Event[]>(url, {
            ...options,
            params: { start_date: start_date, n_events: n_events },
            authType: AuthType.POLIMI,
        })
        return response.data
    },
}
