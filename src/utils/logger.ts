export interface SingleLog {
  content?: string
  date?: Date
  stacktrace?: string[]
}

function getStackTrace() {
  const err = new Error()
  return err.stack?.split("\n")
}

export function logToString(singleLog: SingleLog) {
  return singleLog.date + "\n" + singleLog.content // + "\n" + singleLog.stacktrace
}

export const logs: SingleLog[] = []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logger = (...messages: any[]) => {
  const formattedMessages = messages.map(message =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typeof message === "object" ? JSON.stringify(message) : message
  )
  const log = formattedMessages.join(" ")

  console.log(log)

  const content: string = log.toString()
  logs.push({ content: content, date: new Date(), stacktrace: getStackTrace() })
}
