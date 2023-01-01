import { client, RequestOptions } from "./httpClient"

/* eslint-disable @typescript-eslint/naming-convention */
export interface Lecture {
    event_id: number
    date_start: string
    date_end: string
    favourite: boolean
    show_agenda: boolean
    matricola: string
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
    calendar: {
        calendar_id: number
        calendar_dn: {
            it: string
            en: string
        }
    }
    room: {
        room_id: number
        acronym_dn: string
        classroom_id: number
        room_dn: string
    }
}

/**
 * Collection of endpoints related to Timetable.
 */
export const timetable = {
    /**
     * Retrieves mock timetable from PoliNetwork server.
     */
    async getTimetable(options?: RequestOptions) {
        const response = await client.poliNetworkInstance.get<Lecture[]>(
            "/v1/mock/timetable",
            options
        )
        return response.data
    },
}
