let GMS = true

/* eslint-disable  */

try {
  const { utils } = require("@react-native-firebase/app")
  const result = utils().playServicesAvailability
  GMS = result.isAvailable
} catch (e) {
  console.warn("Error checking for GMS:")
  console.warn(e)
}

/* eslint-enable  */

export function hasGMS() {
  return GMS
}
