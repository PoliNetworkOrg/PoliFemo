import { utils } from '@react-native-firebase/app';

async function checkPlayServicesExample() {
  const { status, isAvailable, hasResolution, isUserResolvableError } =
    utils().playServicesAvailability;
  // all good and valid \o/
  if (isAvailable) return Promise.resolve();
  // if the user can resolve the issue i.e by updating play services
  // then call Google Play's own/default prompting functionality
  if (isUserResolvableError || hasResolution) {
    switch (status) {
      case 1:
        // SERVICE_MISSING - Google Play services is missing on this device.
        // show something to user
        // and then attempt to install if necessary
        return utils().makePlayServicesAvailable();
      case 2:
        // SERVICE_VERSION_UPDATE_REQUIRED - The installed version of Google Play services is out of date.
        // show something to user
        // and then attempt to update if necessary
        return utils().resolutionForPlayServices();

      default:
        // some default dialog / component?
        // use the link below to tailor response to status codes to suit your use case
        // https://developers.google.com/android/reference/com/google/android/gms/common/ConnectionResult#SERVICE_VERSION_UPDATE_REQUIRED
        if (isUserResolvableError) return utils().promptForPlayServices();
        if (hasResolution) return utils().resolutionForPlayServices();
    }
  }
  // There's no way to resolve play services on this device
  // probably best to show a dialog / force crash the app
  return Promise.reject(new Error('Unable to find a valid play services version.'));
}
