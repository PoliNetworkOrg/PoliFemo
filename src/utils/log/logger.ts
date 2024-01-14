import { LogItem } from "./LogItem"
import { LogLevelsKeys } from "./LogLevels"
import { getStackTrace } from "./getStackTrace"
import { logState } from "./logState"

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
  const stack = getStackTrace()
  if (isString(o)) {
    n = {
      date: new Date(),
      level: l,
      msg: o,
      stack: stack,
    }
  } else {
    n = {
      date: new Date(),
      level: l,
      object: o,
      stack: stack,
    }
  }

  logState.push(n)
}
