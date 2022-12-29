import React, { useState } from "react"
import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { NavBar } from "components/NavBar"
import { BodyText, Title } from "components/Text"
import { PoliSearchBar } from "components/Home"
import PositionArrowIcon from "assets/freeClassrooms/positionArrow.svg"
import { useSVG, Canvas, ImageSVG } from "@shopify/react-native-skia"

export const PositionChoice: RootStackScreen<"PositionChoice"> = () => {
    const [search, setSearch] = useState("")
    const { navigate } = useNavigation()
    const { homeBackground, background, primary } = usePalette()

    const positionArrowSVG = useSVG(PositionArrowIcon)

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
                                    backgroundColor: "white",
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
                                Via xxx, Milano
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
                            flexDirection: "row",
                            alignSelf: "center",
                        }}
                    >
                        <Pressable
                            style={{
                                width: 134,
                                height: 44,
                                backgroundColor: primary,
                                borderRadius: 22,
                            }}
                        ></Pressable>
                        <Pressable
                            style={{
                                width: 134,
                                height: 44,
                                backgroundColor: "#8791BD",
                                borderRadius: 22,
                            }}
                        ></Pressable>
                    </View>
                </View>
            </View>
            <NavBar />
        </View>
    )
}
