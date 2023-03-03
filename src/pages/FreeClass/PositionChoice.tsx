import React, { useState, useEffect } from "react"
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
import { HeadquarterItem } from "./HeadquarterChoice"
import { CampusItem } from "./CampusChoice"
import { ValidAcronym } from "utils/rooms"

/**
 * In this page the user can find a room according to his current position.
 */
export const PositionChoice: MainStackScreen<"PositionChoice"> = () => {
  const [locationStatus, setLocationStatus] = useState<PermissionStatus>(
    PermissionStatus.GRANTED
  )
  const [currentLocation, setCurrentLocation] =
    useState<LocationGeocodedAddress>()

  const [currentCoords, setCurrentCoords] = useState<number[]>([])
  const [headquarter, setHeadquarter] = useState<HeadquarterItem>() //nearest headquarter according to user position

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
      }
    }
  }

  /**
   * This function finds the user current position.
   */
  async function getPosition() {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== "granted") {
      setLocationStatus(PermissionStatus.UNDETERMINED)
      setCurrentLocation(undefined)
    } else {
      const { coords } = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = coords
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      })

      void findNearestHeadquarter(latitude, longitude)

      setLocationStatus(PermissionStatus.GRANTED)
      setCurrentCoords([latitude, longitude])
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
      if (status !== "granted") {
        setLocationStatus(PermissionStatus.UNDETERMINED)
        setCurrentLocation(undefined)
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
    void getPosition()
  }, [])

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
        currentCoords={currentCoords}
        locationStatus={locationStatus}
        headquarter={headquarter}
      />
    </PageWrapper>
  )
}
