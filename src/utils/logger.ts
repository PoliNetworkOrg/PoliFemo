export interface SingleLog {
  content?: string
  date?: Date
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
  logs.push({ content: content, date: new Date() })
}
