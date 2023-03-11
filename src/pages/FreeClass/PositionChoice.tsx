import { useState, useEffect, useContext } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { Platform, View } from "react-native"
import { Title } from "components/Text"
import * as Location from "expo-location"
import { LocationGeocodedAddress, PermissionStatus } from "expo-location"
import { AddressText } from "components/FreeClass/AddressText"
import { getDistance } from "geolib"
import { PageWrapper } from "components/Groups/PageWrapper"
import { PositionModality } from "components/FreeClass/PositionModality"
import { ConstructionType } from "api/rooms"
import BuildingListJSON from "components/FreeClass/buildingCoords.json"
import { HeadquarterItem, CampusItem } from "components/FreeClass/DefaultList"
import { ValidAcronym } from "utils/rooms"
import { RoomsSearchDataContext } from "contexts/rooms"

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
  const [headquarter, setHeadquarter] = useState<HeadquarterItem>() //nearest headquarter according to user position

  const { setDate, setAcronym } = useContext(RoomsSearchDataContext)

  /**
   * This function finds the nearest headquarter according the user current position.
   */
  const findNearestHeadquarter = (currentLat: number, currentLong: number) => {
    for (const h of BuildingListJSON) {
      if (
        getDistance(
          { latitude: currentLat, longitude: currentLong },
          {
            latitude: h.latitude,
            longitude: h.longitude,
          }
        ) <= 2000 //2km
      ) {
        const tempCampusList: CampusItem[] = []
        for (const c of h.campus) {
          tempCampusList.push({
            type: ConstructionType.CAMPUS,
            name: c.name,
            acronym: h.acronym as ValidAcronym,
            latitude: c.latitude,
            longitude: c.longitude,
          })
        }
        setHeadquarter({
          type: ConstructionType.HEADQUARTER,
          name: h.name,
          acronym: h.acronym as ValidAcronym,
          campusList: tempCampusList,
        })
        break
      }
    }
  }

  useEffect(() => {
    if (headquarter) {
      setAcronym(headquarter.acronym)
    }
    setDate(new Date())
  }, [headquarter])

  /**
   * This function finds the user current coordinates.
   */
  async function getUserCoordinates() {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== "granted") {
      setLocationStatus(status)
      setCurrentLocation(undefined)
    } else {
      const lastPosition = await Location.getLastKnownPositionAsync()
      if (lastPosition) {
        setCurrentCoords([
          lastPosition.coords.latitude,
          lastPosition.coords.longitude,
        ])
      }
      const { coords } = await Location.getCurrentPositionAsync({}) //in order to get more accurate information
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

      void findNearestHeadquarter(currentCoords[0], currentCoords[1])
    }
  }

  /**
   * This function checks if the location permissions have been granted by the user.
   */
  async function checkPermission() {
    if (Platform.OS === "ios") {
      // idk but hasServicesEnabledAsync does not work on IOS
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
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
    <PageWrapper>
      <View style={{ paddingTop: 28 }}>
        <View style={{ paddingLeft: 28 }}>
          <Title>Posizione attuale</Title>
          <AddressText
            currentLocation={currentLocation}
            locationStatus={locationStatus}
          />
        </View>
      </View>
      <PositionModality
        currentCoords={currentCoords ?? [0, 0]}
        locationStatus={locationStatus}
        headquarter={headquarter}
      />
    </PageWrapper>
  )
}
