import React, { useState, useEffect } from "react"
import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import { Pressable, View, Alert } from "react-native"
import { usePalette } from "utils/colors"
import { NavBar } from "components/NavBar"
import { BodyText, Title } from "components/Text"
import { PoliSearchBar } from "components/Home"
import PositionArrowIcon from "assets/freeClassrooms/positionArrow.svg"
import { useSVG, Canvas, ImageSVG } from "@shopify/react-native-skia"
import { FreeClassList } from "components/FreeClass/FreeClassList"
import { Map } from "components/FreeClass/Map"
import * as Location from "expo-location"
import { LocationGeocodedAddress } from "expo-location"

enum ButtonType {
    MAP,
    LIST,
}

export const PositionChoice: RootStackScreen<"PositionChoice"> = () => {
    const [search, setSearch] = useState("")
    const { homeBackground, background, primary } = usePalette()
    const positionArrowSVG = useSVG(PositionArrowIcon)

    const [status, setStatus] = useState<ButtonType>(ButtonType.MAP)

    const [location, setLocation] = useState<LocationGeocodedAddress>()
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        void (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                console.log("Permission to access location denied!")
                setErrorMsg("Permission to access location denied!")
                return
            }

            const { coords } = await Location.getCurrentPositionAsync({})
            const { latitude, longitude } = coords
            const response = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            })
            setLocation(response[0])
        })()
    }, [])

    if (errorMsg) {
        Alert.alert(
            "Location Service not enabled",
            "Please enable your location services to continue",
            [{ text: "OK" }],
            { cancelable: false }
        )
    }

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
                        <View style={{ flexDirection: "row", marginTop: 19 }}>
                            <View
                                style={{
                                    width: 25,
                                    height: 25,
                                    backgroundColor: background,
                                }}
                            >
                                <Canvas
                                    style={{
                                        flex: 1,
                                        width: 20,
                                    }}
                                >
                                    {positionArrowSVG && (
                                        <ImageSVG
                                            svg={positionArrowSVG}
                                            x={0}
                                            y={0}
                                            width={20}
                                            height={20}
                                        />
                                    )}
                                </Canvas>
                            </View>
                            <BodyText
                                style={{
                                    fontWeight: "900",
                                    color: primary,
                                    fontSize: 20,
                                }}
                            >
                                {location?.name}
                                {","}
                                {location?.city}
                            </BodyText>
                        </View>
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
                                        : "#8791BD",
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
                                        : "#8791BD",
                                borderRadius: 22,
                                marginLeft: 17,
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
                                marginBottom: 100,
                                paddingBottom: 130,
                            }}
                        >
                            <FreeClassList />
                        </View>
                    ) : (
                        <View
                            style={{
                                marginBottom: 100,
                                paddingBottom: 130,
                            }}
                        >
                            <Map />
                        </View>
                    )}
                </View>
            </View>
            <NavBar />
        </View>
    )
}
