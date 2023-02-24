import React, { useState, useEffect } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { Platform, View } from "react-native"
import { Title } from "components/Text"
import * as Location from "expo-location"
import { LocationGeocodedAddress, PermissionStatus } from "expo-location"
import { AddressText } from "components/FreeClass/AddressText"
import { getDistance } from "geolib"
import { api } from "api"
import { BuildingItem } from "./BuildingChoice"
import { PageWrapper } from "components/Groups/PageWrapper"
import { PositionModality } from "components/FreeClass/PositionModality"
import { addHours, ConstructionType, RoomSimplified } from "api/rooms"
import BuildingListJSON from "components/FreeClass/buildingCoords.json"
import { formatBuildingName, getBuildingCoords } from "utils/rooms"

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

  const [buildingList, setBuildingList] = useState<BuildingItem[]>()

  const [roomList, setRoomList] = useState<RoomSimplified[]>()

  //the dateEnd is the startDate + 3 hours, the number of hours has not been chosen yet
  const dateEnd = addHours(new Date(), 3).toISOString() //3 hours is an example

  //main function that handles the call to the API in order to obtain the list of freeclassRooms
  //da rivedere
  const findRoomsAvailable = async (
    currentLat: number,
    currentLong: number
  ) => {
    const tempBuildingList: BuildingItem[] = []
    const tempRoomList: RoomSimplified[] = []
    for (const h of BuildingListJSON) {
      for (const c of h.campus) {
        if (
          getDistance(
            { latitude: currentLat, longitude: currentLong },
            {
              latitude: c.latitude,
              longitude: c.longitude,
            }
          ) <= 50000 //if the distance between the user and the campus is less than 500m I'll call the API,to test I put 50km
        ) {
          //call the API
          try {
            const response = await api.rooms.getFreeRoomsTimeRange(
              h.acronym,
              new Date().toISOString(),
              dateEnd
            )
            if (response.length > 0) {
              const tempBuildingStrings: string[] = []
              const tempBuildings: BuildingItem[] = []
              response.map(room => {
                const roomBuilding: string[] = room.building.split(" ")
                roomBuilding[0] += " "
                const coords = getBuildingCoords(
                  {
                    type: ConstructionType.CAMPUS,
                    name: c.name,
                    acronym: h.acronym,
                    latitude: c.latitude,
                    longitude: c.longitude,
                  },
                  roomBuilding
                )
                //console.log(coords)
                const currentBuildingString = room.building.replace(
                  "Edificio ",
                  "Ed. "
                )
                if (!tempBuildingStrings.includes(currentBuildingString)) {
                  const currentBuilding: BuildingItem = {
                    type: ConstructionType.BUILDING,
                    campus: {
                      type: ConstructionType.CAMPUS,
                      name: c.name,
                      acronym: h.acronym,
                      latitude: c.latitude,
                      longitude: c.longitude,
                    },
                    name: formatBuildingName(room.building),
                    latitude: coords?.latitude,
                    longitude: coords?.longitude,
                    freeRoomList: [
                      {
                        roomId: room.room_id,
                        name: room.name,
                        occupancies: room.occupancies,
                        occupancyRate: room.occupancy_rate ?? undefined,
                      },
                    ],
                  }
                  tempBuildingStrings.push(currentBuildingString)
                  tempBuildings.push(currentBuilding)
                } else {
                  //element already in the list
                  const indexElement = tempBuildingStrings.indexOf(
                    currentBuildingString
                  )
                  tempBuildings[indexElement].freeRoomList.push({
                    roomId: room.room_id,
                    name: room.name,
                    occupancies: room.occupancies,
                    occupancyRate: room.occupancy_rate ?? undefined,
                  })
                }
                if (tempRoomList.length < 50) {
                  tempRoomList.push({
                    roomId: room.room_id,
                    name: room.name,
                    occupancies: room.occupancies,
                    occupancyRate: room.occupancy_rate ?? undefined,
                  })
                } else {
                  setRoomList(tempRoomList)
                }
              })
              tempBuildingList.push(...tempBuildings)
            }
          } catch (error) {
            console.log(error)
          }
        }
        setBuildingList(tempBuildingList)
        break
      }
      break
    }
  }

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
      //temporary solution, too inefficient
      void findRoomsAvailable(latitude, longitude)

      setLocationStatus(PermissionStatus.GRANTED)
      setCurrentCoords([latitude, longitude])
      setCurrentLocation(response[0])
    }
  }

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
        buildingList={buildingList}
        roomList={roomList}
      />
    </PageWrapper>
  )
}
