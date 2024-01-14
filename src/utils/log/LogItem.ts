import { LogLevelsKeys } from "./LogLevels"

export type LogItem = {
  date: Date
  level: LogLevelsKeys
  object?: any | undefined | null
  msg?: string
  stack: string[]
}
