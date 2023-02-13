import React, { useState, useEffect } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { Platform, View } from "react-native"
import { Title } from "components/Text"
import { PoliSearchBar } from "components/Home"
import * as Location from "expo-location"
import { LocationGeocodedAddress, PermissionStatus } from "expo-location"
import { AddressText } from "components/FreeClass/AddressText"
import { CampusItem, campusList } from "./CampusChoice"
import { getDistance } from "geolib"
import { api } from "api"
import { BuildingItem } from "./BuildingChoice"
import { PageWrapper } from "components/Groups/PageWrapper"
import { PositionModality } from "components/FreeClass/PositionModality"
import { addHours } from "api/rooms"
import BuildingListJSON from "components/FreeClass/buildingCoords.json"

/**
 * In this page the user can find a room according to his current position.
 */
export const PositionChoice: MainStackScreen<"PositionChoice"> = () => {
    const [search, setSearch] = useState("")

    const [locationStatus, setLocationStatus] = useState<PermissionStatus>(
        PermissionStatus.GRANTED
    )

    const [currentLocation, setCurrentLocation] =
        useState<LocationGeocodedAddress>()

    const [currentCoords, setCurrentCoords] = useState<number[]>([])

    const [buildingList, setBuildingList] = useState<BuildingItem[]>()

    //the dateEnd is the startDate + 3 hours, the number of hours has not been chosen yet
    const dateEnd = addHours(new Date(), 3).toISOString() //3 hours is an example

    const compareCampusNames = (c1: string[], c2: string[]) => {
        if (c1.length === c2.length) {
            if (c1.length > 1) {
                if (c1[0] === c2[0] && c1[1] === c2[1]) {
                    return true
                } else {
                    return false
                }
            } else {
                if (c1[0] === c2[0]) {
                    return true
                } else {
                    return false
                }
            }
        } else {
            return false
        }
    }

    const getBuildingCoords = (campus: CampusItem, buildingName: string) => {
        for (const element of BuildingListJSON) {
            if (element.acronym === campus.acronym) {
                for (const c of element.campus) {
                    if (compareCampusNames(c.name, campus.name)) {
                        for (const b of c.buildings) {
                            if (b.name === buildingName) {
                                return b.coords
                            }
                        }
                    }
                }
            }
        }
    }

    //main function that handles the call to the API in order to obtain the list of freeclassRooms
    const findRoomsAvailable = async (
        campusList: CampusItem[],
        currentLat: number,
        currentLong: number
    ) => {
        const tempBuildingList: BuildingItem[] = []
        for (const campus of campusList) {
            if (
                getDistance(
                    { latitude: currentLat, longitude: currentLong },
                    {
                        latitude: campus.latitude,
                        longitude: campus.longitude,
                    }
                ) <= 50000 //if the distance between the user and the campus is less than 500m I'll call the API,to test I put 50km
            ) {
                //call the API
                try {
                    const response = await api.rooms.getFreeRoomsTimeRange(
                        campus.acronym,
                        new Date().toISOString(),
                        dateEnd
                    )
                    if (response.length > 0) {
                        const tempBuildingStrings: string[] = []
                        const tempBuildings: BuildingItem[] = []
                        response.map(room => {
                            const coords = getBuildingCoords(
                                campus,
                                room.building
                            )
                            const currentBuildingString = room.building.replace(
                                "Edificio ",
                                "Ed. "
                            )
                            if (
                                !tempBuildingStrings.includes(
                                    currentBuildingString
                                )
                            ) {
                                const currentBuilding: BuildingItem = {
                                    campus: campus,
                                    name: room.building,
                                    latitude: coords?.latitude,
                                    longitude: coords?.longitude,
                                    freeRoomList: [
                                        {
                                            roomId: room.room_id,
                                            name: room.name,
                                        },
                                    ],
                                }
                                tempBuildingStrings.push(currentBuildingString)
                                tempBuildings.push(currentBuilding)
                            } else {
                                //element already in the list
                                const indexElement =
                                    tempBuildingStrings.indexOf(
                                        currentBuildingString
                                    )
                                tempBuildings[indexElement].freeRoomList.push({
                                    roomId: room.room_id,
                                    name: room.name,
                                })
                            }
                        })
                        tempBuildingList.push(...tempBuildings)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        setBuildingList(tempBuildingList)
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
            //temporary solution, too inefficient?
            void findRoomsAvailable(campusList, latitude, longitude)

            setLocationStatus(PermissionStatus.GRANTED)
            setCurrentCoords([latitude, longitude])
            setCurrentLocation(response[0])
        }
    }

    async function checkPermission() {
        if (Platform.OS === "ios") {
            // idk but hasServicesEnabledAsync does not work on IOS
            const { status } =
                await Location.requestForegroundPermissionsAsync()
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
        const intervalId = setInterval(() => void checkPermission(), 2000) // in milliseconds,call every 2 sec(this could be modified)
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
                <View style={{ marginTop: -20 }}>
                    <PoliSearchBar
                        onChange={searchKey => setSearch(searchKey)}
                    />
                </View>
            </View>
            <PositionModality
                currentCoords={currentCoords}
                locationStatus={locationStatus}
                buildingList={buildingList}
            />
        </PageWrapper>
    )
}
