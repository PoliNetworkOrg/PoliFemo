/* eslint-disable @typescript-eslint/naming-convention */
export interface Article {
    event_id: number
    date_start: Date
    date_end: Date
    favourite: boolean
    show_agenda: boolean
    matricola: number
    title: {
        it: string
        en: string
    }
    event_type: {
        typeId: string
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
        acronym_dn: number
        classroom_id: number
        room_dn: string
    }
}
