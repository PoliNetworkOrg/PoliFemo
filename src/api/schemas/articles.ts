/* eslint-disable @typescript-eslint/naming-convention */
import { z } from "zod"

export const tagSchema = z.object({
  name: z.string(),
  image: z.string(),
  blurhash: z.string(),
})

export const tagsSchema = z.object({
  tags: z.array(tagSchema),
})
export type Tags = z.infer<typeof tagsSchema>

const articleAuthorSchema = z.object({
  name: z.string().nullable(),
  link: z.string().nullable(),
  image: z.string().nullable(),
})

const articlesParamsSchema = z.object({
  content: z.string(),
  title: z.string(),
  subtitle: z.string(),
  url: z.string(),
})

export const articleSchema = z.object({
  id: z.number(),
  tag_id: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  publish_time: z.string(),
  target_time: z.string().nullable(),
  hidden_until: z.string().nullable(),
  content: z.object({
    it: articlesParamsSchema,
    en: articlesParamsSchema,
  }),
  image: z.string().nullable(),
  blurhash: z.string().nullable(),
  author: articleAuthorSchema.nullable(),
})
export type Article = z.infer<typeof articleSchema>

export const articlesSchema = z.object({
  articles: z.array(articleSchema),
  start: z.string().nullable(),
  end: z.string().nullable(),
  tag: z.string().nullable(),
  author_id: z.number().nullable(),
  title: z.string().nullable(),
})
export type Articles = z.infer<typeof articlesSchema>
