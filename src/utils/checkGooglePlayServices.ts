import { utils } from "@react-native-firebase/app"

export function checkPlayServicesExample() {
  try {
    const { isAvailable } = utils().playServicesAvailability

    if (isAvailable) return true

    return false
  } catch (err) {
    return false
  }
}
