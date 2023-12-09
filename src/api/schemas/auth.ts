/* eslint-disable @typescript-eslint/naming-convention */
import { z } from "zod"

export const poliNetworkTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  ext_expires_in: z.number(),
  id_token: z.string(),
  refresh_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
})
export type PoliNetworkToken = z.infer<typeof poliNetworkTokenSchema>

export const polimiTokenSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number(),
  refreshToken: z.string(),
})
export type PolimiToken = z.infer<typeof polimiTokenSchema>

export const tokensSchema = z.object({
  polimiToken: polimiTokenSchema,
  poliNetworkToken: poliNetworkTokenSchema,
})
export type Tokens = z.infer<typeof tokensSchema>
