export const logs: string[] = []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logger = (...messages: any[]) => {
  const formattedMessages = messages.map(message =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typeof message === "object" ? JSON.stringify(message) : message
  )
  const log = formattedMessages.join(" ")

  console.log(log)
  logs.push(log.toString())
}
