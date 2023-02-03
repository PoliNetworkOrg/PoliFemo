import React, { useState, useEffect } from "react"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
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
import { campusList } from "./CampusChoice"
import { getDistance } from "geolib"

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

    const { navigate } = useNavigation()

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
                    ) <= 500 //if the distance between the user and the campus is less than 500m I'll call the API
                ) {
                    //call the API,not yet performed
                    //so far I put a marker on the campus
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
                            <FreeClassList
                                data={["ciao", "ciao", "ciao", "ciao", "ciao"]}
                            />
                        </View>
                    ) : (
                        <Map
                            latitude={currentCoords[0]}
                            longitude={currentCoords[1]}
                            locationStatus={locationStatus}
                            currentCampus={currentCampus}
                        />
                    )}
                </View>
            </View>
            <NavBar />
        </View>
    )
}
