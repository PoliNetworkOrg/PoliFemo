import { consoleTransport, logger } from "react-native-logs"

const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: "debug",
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
    enabledExtensions: ["root", "httpClient"],
    extensionColors: {
      root: "magenta",
      httpClient: "cyan",
      // ...
    },
  },
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: true,
}

export const log = logger.createLogger<"debug" | "info" | "warn" | "error">(
  config
)
export const rootLog = log.extend("root")
export const httpClientLog = log.extend("httpClient")
// add any needed custom log...
