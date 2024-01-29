/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogItem } from "./LogItem"
import { LogLevelsKeys } from "./LogLevels"
import { getStackTrace } from "./getStackTrace"
import { logState } from "./logState"

function isString(value: any): boolean {
  return typeof value === "string"
}

export function loggerInfo(o: any) {
  loggerMain({ o, l: "info" })
}

export function loggerErr(o: any) {
  loggerMain({ o, l: "error" })
}

export function loggerDebug(o: any) {
  loggerMain({ o, l: "debug" })
}

export function loggerWarn(o: any) {
  loggerMain({ o, l: "warn" })
}

function loggerMain({ o, l }: { o: any; l: LogLevelsKeys }) {
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
