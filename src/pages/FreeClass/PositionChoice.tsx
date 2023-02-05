import React, { useState, useEffect } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { NavBar } from "components/NavBar"
import { BodyText, Title } from "components/Text"
import { PoliSearchBar } from "components/Home"
import { FreeClassList } from "components/FreeClass/FreeClassList"
import { Map } from "components/FreeClass/Map"
import * as Location from "expo-location"
import { LocationGeocodedAddress, PermissionStatus } from "expo-location"
import { AddressText } from "components/FreeClass/AddressText"
import { CampusItem, campusList } from "./CampusChoice"
import { getDistance } from "geolib"
import { api } from "api"
import { BuildingItem } from "./BuildingChoice"

enum ButtonType {
    MAP,
    LIST,
}

export const PositionChoice: MainStackScreen<"PositionChoice"> = () => {
    const [search, setSearch] = useState("")
    const { homeBackground, background, primary, isDark, palette } =
        usePalette()

    const [status, setStatus] = useState<ButtonType>(ButtonType.MAP)

    const [locationStatus, setLocationStatus] = useState<PermissionStatus>(
        PermissionStatus.GRANTED
    )

    const [currentLocation, setCurrentLocation] =
        useState<LocationGeocodedAddress>()

    const [currentCoords, setCurrentCoords] = useState<number[]>([])

    const [currentCampus, setCurrentCampus] = useState<number[]>([])

    const [roomList, setRoomList] = useState<number[]>([])

    function addHours(dateStart: Date, hours: number) {
        const tempDate = new Date(dateStart.getTime())
        tempDate.setHours(tempDate.getHours() + hours)
        return tempDate
    }

    //the dateEnd is the startDate + 8 hours, the number of hours has not been chosen yet
    const dateEnd = addHours(new Date(), 8).toISOString() //8 hours is an example

    //main function that handles the call to the API in order to obtain the list of freeclassRooms
    const findRoomsAvailable = async (campus: CampusItem) => {
        try {
            const response = await api.rooms.getFreeRoomsTimeRange(
                campus.acronym,
                new Date().toISOString(),
                dateEnd,
            )
            if (response.length > 0) {
                const tempBuildingStrings: string[] = []
                const tempRoomList: number[] = []
                const tempBuildings: BuildingItem[] = []
                response.map(room => {
                    const currentBuildingString = room.building.replace(
                        "Edificio ",
                        "Ed. "
                    )
                    if (!tempBuildingStrings.includes(currentBuildingString)) {
                        const currentBuilding: BuildingItem = {
                            campus: campus,
                            name: room.building.replace("Edificio ", "Ed. "),
                            freeRoomList: [room.room_id],
                        }
                        tempBuildingStrings.push(currentBuildingString)
                        tempBuildings.push(currentBuilding)
                    } else {
                        //element already present in the list
                        const indexElement = tempBuildingStrings.indexOf(
                            currentBuildingString
                        )
                        tempBuildings[indexElement].freeRoomList.push(
                            room.room_id
                        )
                    }
                    tempRoomList.push(room.room_id)
                })
                setRoomList(tempRoomList)
            }
        } catch (error) {
            console.log(error)
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
            campusList.map(campus => {
                if (
                    getDistance(
                        { latitude: latitude, longitude: longitude },
                        {
                            latitude: campus.latitude,
                            longitude: campus.longitude,
                        }
                    ) <= 50000 //if the distance between the user and the campus is less than 500m I'll call the API
                ) {
                    //call the API
                    void findRoomsAvailable(campus)
                    setCurrentCampus([campus.latitude, campus.longitude])
                }
            })
            setLocationStatus(PermissionStatus.GRANTED)
            setCurrentCoords([latitude, longitude])
            setCurrentLocation(response[0])
        }
    }

    async function checkPermission() {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
            setLocationStatus(PermissionStatus.UNDETERMINED)
            setCurrentLocation(undefined)
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => void checkPermission(), 1000 * 2) // in milliseconds,call every 2 sec(this could be modified)
        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        void getPosition()
    }, [])

    return (
        <View
            style={{
                flex: 1,
                alignItems: "stretch",
                backgroundColor: homeBackground,
            }}
        >
            <View
                style={{
                    flex: 1,
                    marginTop: 106,
                }}
            >
                <View
                    style={{
                        paddingBottom: 400,
                        backgroundColor: background,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,

                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.43,
                        shadowRadius: 9.51,

                        elevation: 15,
                    }}
                >
                    <View
                        //view containing the title
                        style={{
                            paddingHorizontal: 28,
                            marginTop: 28,
                            marginBottom: 17,
                        }}
                    >
                        <Title style={{ fontSize: 40 }}>
                            Posizione Attuale
                        </Title>
                        <AddressText
                            currentLocation={currentLocation}
                            locationStatus={locationStatus}
                        />
                    </View>
                    <View style={{ marginTop: -35 }}>
                        <PoliSearchBar
                            onChange={searchKey => setSearch(searchKey)}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: 22,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <Pressable
                            style={{
                                width: 134,
                                height: 44,
                                backgroundColor:
                                    status === ButtonType.MAP
                                        ? primary
                                        : isDark
                                        ? palette.primary
                                        : palette.lighter,
                                borderRadius: 22,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => setStatus(ButtonType.MAP)}
                        >
                            <BodyText
                                style={{
                                    fontWeight:
                                        status === ButtonType.MAP
                                            ? "900"
                                            : "500",
                                    color: "white",
                                }}
                            >
                                Mappa
                            </BodyText>
                        </Pressable>
                        <Pressable
                            style={{
                                width: 134,
                                height: 44,
                                backgroundColor:
                                    status === ButtonType.LIST
                                        ? primary
                                        : isDark
                                        ? palette.primary
                                        : palette.lighter,
                                borderRadius: 22,
                                marginLeft: 18,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => setStatus(ButtonType.LIST)}
                        >
                            <BodyText
                                style={{
                                    fontWeight:
                                        status === ButtonType.LIST
                                            ? "900"
                                            : "500",
                                    color: "white",
                                }}
                            >
                                Lista
                            </BodyText>
                        </Pressable>
                    </View>

                    {status === ButtonType.LIST ? (
                        <View
                            style={{
                                marginBottom: 90,
                                paddingBottom: 100,
                            }}
                        >
                            <FreeClassList data={roomList} />
                        </View>
                    ) : (
                        <Map
                            latitude={currentCoords[0]}
                            longitude={currentCoords[1]}
                            locationStatus={locationStatus}
                            currentCampus={currentCampus}
                            onPressMarker={() => setStatus(ButtonType.LIST)}
                        />
                    )}
                </View>
            </View>
            <NavBar />
        </View>
    )
}
