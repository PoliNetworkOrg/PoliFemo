const ExpoConfig = require("@expo/config")
const path = require("path")
const fs = require("fs/promises")

const pathname = path.join(__dirname, "..")

const { exp } = ExpoConfig.getConfig(pathname, {
  skipSDKVersionRequirement: true,
  isPublicConfig: true,
})

fs.writeFile("./dist/expoConfig.json", JSON.stringify(exp))
fs.writeFile("./dist/date", new Date().toISOString())
