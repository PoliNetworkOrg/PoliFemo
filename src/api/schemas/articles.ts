/* eslint-disable @typescript-eslint/naming-convention */
import { z } from "zod"

export const tagSchema = z.object({
  name: z.string(),
  image: z.string(),
  blurhash: z.string(),
})
export type Tag = z.infer<typeof tagSchema>

export const tagsSchema = z.object({
  tags: z.array(tagSchema),
})
export type Tags = z.infer<typeof tagsSchema>

const articleAuthorSchema = z.object({
  name: z.string().optional(),
  link: z.string().optional(),
  image: z.string().optional(),
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
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  publish_time: z.string(),
  target_time: z.string().optional(),
  hidden_until: z.string().optional(),
  content: z.object({
    it: articlesParamsSchema,
    en: articlesParamsSchema,
  }),
  image: z.string().optional(),
  blurhash: z.string().optional(),
  author: articleAuthorSchema.optional(),
})
export type Article = z.infer<typeof articleSchema>

export const articlesSchema = z.object({
  articles: z.array(articleSchema),
  start: z.string().optional(),
  end: z.string().optional(),
  tag: z.string().optional(),
  author_id: z.number().optional(),
  title: z.string().optional(),
})
export type Articles = z.infer<typeof articlesSchema>
