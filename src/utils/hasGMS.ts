let GMS = true

/* eslint-disable  */

try {
  const { utils } = require("@react-native-firebase/app")
  const result = utils().playServicesAvailability
  GMS = result.isAvailable
} catch (e) {
  console.error(e)
}

/* eslint-enable  */

export function hasGMS() {
  return GMS
}
