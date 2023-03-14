import { utils } from "@react-native-firebase/app"
import { Platform } from "react-native"

export function checkPlayServicesExample() {
  try {
    const { isAvailable } = utils().playServicesAvailability

    if (isAvailable && Platform.OS == "android") return true

    return false
  } catch (err) {
    return false
  }
}
