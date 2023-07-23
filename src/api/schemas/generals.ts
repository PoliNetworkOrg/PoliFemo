import { z } from "zod"

export const translatedStringSchema = z.object({
  it: z.string(),
  en: z.string(),
})
export type TranslatedString = z.infer<typeof translatedStringSchema>
