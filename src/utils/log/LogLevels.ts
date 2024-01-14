export type LogLevelsKeys = "debug" | "info" | "warn" | "error"

export const logLevelValues: { [key in LogLevelsKeys]: number } = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}
