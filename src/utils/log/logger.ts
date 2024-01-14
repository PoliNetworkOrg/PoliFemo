import { LogLevelsKeys } from "./LogLevels"

type LogItem = {
  date: Date
  level: LogLevelsKeys
  object?: any
  msg?: string
}

export const logValues: LogItem[] = []

function isString(value: any): boolean {
  return typeof value === "string"
}

export function logger_info(o: any) {
  logger_main({ o, l: "info" })
}

export function logger_err(o: any) {
  logger_main({ o, l: "error" })
}

export function logger_debug(o: any) {
  logger_main({ o, l: "debug" })
}

export function logger_warn(o: any) {
  logger_main({ o, l: "warn" })
}

function logger_main({ o, l }: { o: any; l: LogLevelsKeys }) {
  if (isString(o)) {
    const n: LogItem = { date: new Date(), level: l, msg: o }
    logValues.push(n)
  } else {
    const n: LogItem = { date: new Date(), level: l, object: o }
    logValues.push(n)
  }
}
