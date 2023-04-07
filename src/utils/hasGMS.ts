export enum GMSStatus {
  /**
   * Google Play Services is not present on the device.
   */
  ABSENT = "absent",

  /**
   * Google Play Services is present on the device.
   */
  PRESENT = "present",

  /**
   * The status of Google Play Services is unknown, availability cannot be
   * determined (can happen if no native module for firebase is present as in
   * Expo Go).
   * This is the default value.
   */
  UNKNOWN = "unknown",
}

let GMS = GMSStatus.UNKNOWN

/* eslint-disable  */

try {
  const { utils } = require("@react-native-firebase/app")
  const result = utils().playServicesAvailability
  GMS = result.isAvailable ? GMSStatus.PRESENT : GMSStatus.ABSENT
} catch (e) {
  console.warn("Error checking for GMS:")
  console.warn(e)
}

/* eslint-enable  */

/**
 * Returns the status of Google Play Services on the device.
 * For most use cases check out {@link hasGMS} instead.
 *
 * @returns `GMSStatus.ABSENT` if GMS is not present, `GMSStatus.PRESENT` if GMS
 * is present, `GMSStatus.UNKNOWN` if the status is unknown.
 */
export function getGMSStatus(): GMSStatus {
  return GMS
}

/**
 * Returns whether Google Play Services is present on the device.
 * This should be used to determine whether or not to suppress features that
 * require GMS. If the status is unknown, this will return `true` (e.g Expo Go).
 *
 * @returns `true` if GMS is present or unknown, `false` otherwise.
 */
export function hasGMS(): boolean {
  return GMS !== GMSStatus.ABSENT
}
