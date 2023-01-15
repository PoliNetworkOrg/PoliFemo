import React, { useState } from "react"
import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View, Dimensions, Pressable, Alert, Platform } from "react-native"
import { PoliSearchBar } from "components/Home"
import { usePalette } from "utils/colors"
import { NavBar } from "components/NavBar"
import { Title, BodyText } from "components/Text"
import { ScrollView } from "react-native-gesture-handler"
import { Canvas, useSVG, ImageSVG } from "@shopify/react-native-skia"
import campusIcon from "assets/freeClassrooms/campus.svg"
import position1Icon from "assets/freeClassrooms/position1.svg"
import position2Icon from "assets/freeClassrooms/position2.svg"
import * as Location from "expo-location"

const { width } = Dimensions.get("window")

enum SearchClassType {
    GPS_POSITION,
    CAMPUS,
}
interface FreeClassInterface {
    id: number
    type: SearchClassType
    text: string[]
}

const freeClassButtons: FreeClassInterface[] = [
    {
        id: 0,
        type: SearchClassType.GPS_POSITION,
        text: ["In base alla tua", "posizione"],
    },
    { id: 1, type: SearchClassType.CAMPUS, text: ["Scegli il tuo", "campus"] },
]

export const FreeClassrooms: RootStackScreen<"FreeClassrooms"> = () => {
    const [search, setSearch] = useState("")
    const { navigate } = useNavigation()
    const { homeBackground, background, palette } = usePalette()

    const campusSVG = useSVG(campusIcon)
    const position1SVG = useSVG(position1Icon)
    const position2SVG = useSVG(position2Icon)

    const [geolocation, setGeoloaction] = useState<boolean>(false)

    const handlePositionPressed = async () => {
        if (geolocation) {
            navigate("PositionChoice")
        } else {
            const { status } =
                await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                Alert.alert(
                    "Location Service not enabled",
                    "Please enable your location services to unlock this feature",
                    [{ text: "OK" }],
                    { cancelable: false }
                )
            } else {
                setGeoloaction(true)
                navigate("PositionChoice")
            }
        }
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: homeBackground,
            }}
        >
            <View
                style={{
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
                        <Title style={{ fontSize: 40 }}>Aule Libere</Title>
                    </View>
                    <PoliSearchBar
                        onChange={searchKey => setSearch(searchKey)}
                    />
                    <ScrollView
                        style={
                            Platform.OS === "ios"
                                ? { marginBottom: 50, paddingBottom: 50 }
                                : { marginBottom: 93 }
                        }
                        showsVerticalScrollIndicator={false}
                        bounces={true}
                        contentContainerStyle={{
                            width,
                            alignItems: "center",
                        }}
                    >
                        {freeClassButtons.map(element => {
                            return (
                                <Pressable
                                    key={"freeClass_" + element.id}
                                    style={{
                                        marginTop: 18,
                                        backgroundColor: palette.primary,
                                        width: width - 54,
                                        height: 190,
                                        borderRadius: 12,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 7,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 4,
                                        alignItems: "center",
                                    }}
                                    onPress={
                                        element.type === SearchClassType.CAMPUS
                                            ? () => navigate("CampusChoice")
                                            : () => handlePositionPressed()
                                    }
                                >
                                    <Canvas
                                        style={{
                                            flex: 1,
                                            width:
                                                element.type ===
                                                SearchClassType.CAMPUS
                                                    ? 90
                                                    : 80,
                                            alignSelf: "center",
                                            marginTop:
                                                element.type ===
                                                SearchClassType.CAMPUS
                                                    ? 33
                                                    : 28,
                                        }}
                                    >
                                        {element.type ===
                                            SearchClassType.GPS_POSITION &&
                                            position1SVG && (
                                                <ImageSVG
                                                    svg={position1SVG}
                                                    x={11}
                                                    y={0}
                                                    width={54}
                                                    height={76}
                                                />
                                            )}
                                        {element.type ===
                                            SearchClassType.GPS_POSITION &&
                                            position2SVG && (
                                                <ImageSVG
                                                    svg={position2SVG}
                                                    x={0}
                                                    y={65}
                                                    width={79}
                                                    height={27}
                                                />
                                            )}
                                        {element.type ===
                                            SearchClassType.CAMPUS &&
                                            campusSVG && (
                                                <ImageSVG
                                                    svg={campusSVG}
                                                    x={0}
                                                    y={0}
                                                    width={90}
                                                    height={85}
                                                />
                                            )}
                                    </Canvas>
                                    <BodyText
                                        style={{
                                            fontWeight: "300",
                                            color: "white",
                                            marginBottom: 23,
                                        }}
                                    >
                                        {element.text[0]}{" "}
                                        <BodyText
                                            style={{
                                                fontWeight: "900",
                                                color: "white",
                                            }}
                                        >
                                            {element.text[1]}
                                        </BodyText>
                                    </BodyText>
                                </Pressable>
                            )
                        })}
                    </ScrollView>
                </View>
            </View>
            <NavBar />
        </View>
    )
}
