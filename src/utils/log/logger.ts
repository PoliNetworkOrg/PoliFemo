import { LogLevelsKeys } from "./LogLevels"

export type LogItem = {
  date: Date
  level: LogLevelsKeys
  object?: any | undefined | null
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

function isString(value: any | undefined | null): boolean {
  return typeof value === "string"
}

export function loggerInfo(o: any | undefined | null) {
  loggerMain({ o, l: "info" })
}

export function loggerErr(o: any | undefined | null) {
  loggerMain({ o, l: "error" })
}

export function loggerDebug(o: any | undefined | null) {
  loggerMain({ o, l: "debug" })
}

export function loggerWarn(o: any | undefined | null) {
  loggerMain({ o, l: "warn" })
}

function loggerMain({ o, l }: { o: any | undefined | null; l: LogLevelsKeys }) {
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
