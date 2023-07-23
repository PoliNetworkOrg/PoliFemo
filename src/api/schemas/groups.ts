/* eslint-disable @typescript-eslint/naming-convention */
import { z } from "zod"

export const groupOptionsSchema = z.object({
  name: z.string().optional(),
  year: z.string().optional(),
  degree: z.string().optional(),
  type: z.string().optional(),
  platform: z.string().optional(),
  language: z.string().optional(),
  office: z.string().optional(),
})
export type GroupOptions = z.infer<typeof groupOptionsSchema>

export const groupSchema = z.object({
  class: z.string().nullable(),
  office: z.string().optional(),
  id: z.string(),
  degree: z.string().optional(),
  school: z.string().optional(),
  id_link: z.string(),
  language: z.string().optional(),
  type: z.string().optional(),
  year: z.string().nullable(),
  platform: z.string(),
  permanentId: z.number().optional(),
  LastUpdateInviteLinkTime: z.string().optional(),
  linkfunzionante: z.string().optional(),
  LinkType: z.string().optional(),
  members: z.string().optional(),
})
export type Group = z.infer<typeof groupSchema>
