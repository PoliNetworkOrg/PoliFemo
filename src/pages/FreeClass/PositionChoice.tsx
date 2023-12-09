import { useState, useEffect } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { Platform, View } from "react-native"
import * as Location from "expo-location"
import { LocationGeocodedAddress, PermissionStatus } from "expo-location"
import { AddressText } from "components/FreeClass/AddressText"
import { PositionModality } from "components/FreeClass/PositionModality"
import { useTranslation } from "react-i18next"
import { PageWrap } from "components/PageLayout"

/**
 * In this page the user can find a room according to his current position.
 */
export const PositionChoice: MainStackScreen<"PositionChoice"> = () => {
  const [locationStatus, setLocationStatus] = useState<PermissionStatus>(
    PermissionStatus.GRANTED
  )
  const [currentLocation, setCurrentLocation] =
    useState<LocationGeocodedAddress>()

  const [currentCoords, setCurrentCoords] = useState<[number, number]>()

  const { t } = useTranslation("freeClass")

  /**
   * This function finds the user current coordinates.
   */
  async function getUserCoordinates() {
    const { status } = await Location.requestForegroundPermissionsAsync()
    setLocationStatus(status)

    if (status !== PermissionStatus.GRANTED) setCurrentLocation(undefined)
    else {
      const lastPosition = await Location.getLastKnownPositionAsync()
      if (lastPosition) {
        setCurrentCoords([
          lastPosition.coords.latitude,
          lastPosition.coords.longitude,
        ])
      }
      //in order to get more accurate information
      const { coords } = await Location.getCurrentPositionAsync({})
      setCurrentCoords([coords.latitude, coords.longitude])
    }
  }

  async function getUserLocation() {
    if (currentCoords) {
      const response = await Location.reverseGeocodeAsync({
        latitude: currentCoords[0],
        longitude: currentCoords[1],
      })
      setLocationStatus(PermissionStatus.GRANTED)
      setCurrentLocation(response[0])
    }
  }

  /**
   * This function checks if the location permissions have been granted by the user.
   */
  async function checkPermission() {
    if (Platform.OS === "ios") {
      // idk but hasServicesEnabledAsync does not work on IOS
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== PermissionStatus.GRANTED) {
        setLocationStatus(PermissionStatus.UNDETERMINED)
        setCurrentLocation(undefined)
      } else {
        setLocationStatus(PermissionStatus.GRANTED)
      }
    } else {
      const res = await Location.hasServicesEnabledAsync()
      if (!res) {
        setLocationStatus(PermissionStatus.UNDETERMINED)
        setCurrentLocation(undefined)
      } else {
        setLocationStatus(PermissionStatus.GRANTED)
      }
    }
    return
  }

  useEffect(() => {
    const intervalId = setInterval(() => void checkPermission(), 2000) //call every 2 sec
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (locationStatus !== PermissionStatus.GRANTED) {
      return
    } else {
      void getUserCoordinates()
    }
  }, [locationStatus])

  useEffect(() => {
    void getUserLocation()
  }, [currentCoords])

  return (
    <PageWrap title={t("freeClass_exactPosition") + ""}>
      <View style={{ paddingHorizontal: 28 }}>
        <AddressText
          currentLocation={currentLocation}
          locationStatus={locationStatus}
        />
      </View>
      <PositionModality
        currentCoords={currentCoords ?? [0, 0]}
        locationStatus={locationStatus}
      />
    </PageWrap>
  )
}
