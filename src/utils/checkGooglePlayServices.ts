import { utils } from "@react-native-firebase/app"
import { Platform } from "react-native"

export function checkPlayServicesExample() {
  try {
    const result = utils().playServicesAvailability

    console.log(result)

    if (result.isAvailable && Platform.OS == "android") return true

    return false
  } catch (err) {
    console.error(err)
    return false
  }
}
