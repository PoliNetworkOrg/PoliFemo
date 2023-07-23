/* eslint-disable @typescript-eslint/naming-convention */
import { z } from "zod"
import { translatedStringSchema } from "./generals"

const eventTypeSchema = z.object({
  typeId: z.number(),
  type_dn: translatedStringSchema,
})

const calendarTypeSchema = z.object({
  calendar_id: z.number(),
  calendar_dn: translatedStringSchema,
})

export const eventSchema = z.object({
  event_id: z.number(),
  date_start: z.string(),
  date_end: z.string(),
  show_agenda: z.boolean(),
  matricola: z.string().optional(),
  title: translatedStringSchema,
  event_type: eventTypeSchema,
  event_subtype: z.string().optional(),
  calendar: calendarTypeSchema,
  room: z
    .object({
      room_id: z.number(),
      acronym_dn: z.string(),
      classroom_id: z.number(),
      room_dn: z.string(),
    })
    .optional(),
  lectureColor: z.string().optional(),
})
export type Event = z.infer<typeof eventSchema>

export const remoteLinkSchema = z.object({
  url: z.string(),
  link_description: translatedStringSchema,
})
export type RemoteLink = z.infer<typeof remoteLinkSchema>

export const lectureSchema = z.object({
  event_id: z.number(),
  room_id: z.number(),
  date_start: z.string(),
  date_end: z.string(),
  class_code: z.number(),
  teaching_description: translatedStringSchema,
  lecturer: z.string(),
  lecture_type: z.string(),
  event_type: eventTypeSchema,
  calendar: calendarTypeSchema,
  room: z.object({
    room_id: z.number(),
    campus: z.string(),
    address: z.string(),
    floor: z.string(),
    building: z.string(),
    type: z.string(),
    acronym_dn: z.string(),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
    csi_id: z.string(),
    csi_parent_id: z.string(),
    classroom_id: z.number(),
    room_dn: z.string(),
  }),
  remote_links: z.array(remoteLinkSchema),
})
export type Lecture = z.infer<typeof lectureSchema>

export const lectureDetailsSchema = z.object({
  lecture: lectureSchema,
  personal_event: eventSchema,
})
export type LectureDetails = z.infer<typeof lectureDetailsSchema>
