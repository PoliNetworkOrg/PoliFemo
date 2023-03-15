import { utils } from "@react-native-firebase/app"

export function checkPlayServicesExample() {
  try {
    const result = utils().playServicesAvailability

    console.log(result)

    return result.isAvailable
  } catch (err) {
    console.error(err)
    return false
  }
}
