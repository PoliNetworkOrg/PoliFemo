import { LogLevelsKeys } from "./LogLevels"

export type LogItem = {
  date: Date
  level: LogLevelsKeys
  object?: any
  msg?: string
  stack: string[]
}

function getStackTrace(): string[] {
  try {
    throw new Error()
  } catch (error) {
    if (error instanceof Error) {
      return (error.stack ?? "").split("\n").slice(1)
    }
    return []
  }
}

export const logState: LogItem[] = []

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
  let n: LogItem
  if (isString(o)) {
    n = {
      date: new Date(),
      level: l,
      msg: o,
      stack: getStackTrace(),
    }
  } else {
    n = {
      date: new Date(),
      level: l,
      object: o,
      stack: getStackTrace(),
    }
  }

  logState.push(n)
}
