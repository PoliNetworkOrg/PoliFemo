import { useSVG, Canvas, ImageSVG } from "@shopify/react-native-skia"
import { BodyText } from "components/Text"
import React, { FC } from "react"
import { FlatList, View, Pressable, Dimensions } from "react-native"
import { usePalette } from "utils/colors"
import timerIcon from "assets/freeClassrooms/timer.svg"
import overcrowdingIcon from "assets/freeClassrooms/overcrowding.svg"
import fireIcon from "assets/freeClassrooms/fire.svg"
import rooms from "pages/FreeClass/Room.json"

const { width } = Dimensions.get("window")

export const FreeClassList: FC = () => {
    const { primary } = usePalette()
    const timerSVG = useSVG(timerIcon)
    const overcrowdingSVG = useSVG(overcrowdingIcon)
    const fireSVG = useSVG(fireIcon)

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            style={{
                marginTop: 23,
                width,
            }}
            contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
            }}
            data={rooms}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
                <Pressable
                    style={{
                        width: width - 65,
                        height: 93,
                        backgroundColor: "#8791BD",
                        marginBottom: 24,
                        borderRadius: 12,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            width: width - 65,
                            height: 30,
                            alignSelf: "center",
                            marginTop: 12,
                            justifyContent: "center",
                        }}
                    >
                        <Canvas
                            style={{
                                position: "absolute",
                                width: 28,
                                height: 33,
                                alignSelf: "center",
                            }}
                        >
                            {timerSVG && (
                                <ImageSVG
                                    svg={timerSVG}
                                    x={0}
                                    y={0}
                                    width={28}
                                    height={33}
                                />
                            )}
                        </Canvas>
                        <BodyText
                            style={{
                                position: "absolute",
                                fontWeight: "300",
                                fontSize: 12,
                                color: "white",
                                textAlign: "left",
                                paddingLeft: 100,
                                marginTop: 3,
                            }}
                        >
                            Libera per{"\n"}
                            <BodyText
                                style={{
                                    fontWeight: "700",
                                    fontSize: 14,
                                    color: "#414867",
                                }}
                            >
                                2 h 23{"'"}
                            </BodyText>
                        </BodyText>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            width: width - 65,
                            height: 51,
                            justifyContent: "flex-end",
                        }}
                    >
                        <BodyText
                            style={{
                                position: "absolute",
                                fontWeight: "500",
                                fontSize: 12,
                                color: "#424967",
                                textAlign: "right",
                                paddingRight: 45,
                                marginTop: 12,
                            }}
                        >
                            Mediamente{"\n"}
                            <BodyText
                                style={{
                                    fontWeight: "300",
                                    fontSize: 12,
                                    color: "#414867",
                                }}
                            >
                                affollato
                            </BodyText>
                        </BodyText>
                        <View
                            style={{
                                position: "relative",
                                width: 40,
                                height: 51,
                            }}
                        >
                            <Canvas
                                style={{
                                    position: "absolute",
                                    zIndex: 1,
                                    width: 40,
                                    height: 51,
                                    marginTop: 10,
                                }}
                            >
                                {overcrowdingSVG && (
                                    <ImageSVG
                                        svg={overcrowdingSVG}
                                        x={3}
                                        y={7}
                                        width={24}
                                        height={19}
                                    />
                                )}
                            </Canvas>
                            <Canvas
                                style={{
                                    zIndex: 0,
                                    width: 40,
                                    height: 51,
                                }}
                            >
                                {fireSVG && (
                                    <ImageSVG
                                        svg={fireSVG}
                                        x={0}
                                        y={4}
                                        width={29}
                                        height={39}
                                    />
                                )}
                            </Canvas>
                        </View>
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            backgroundColor: primary,
                            width: "40%",
                            height: 93,
                            borderRadius: 12,
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 7,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                        }}
                    >
                        <BodyText
                            style={{
                                fontWeight: "700",
                                color: "white",
                                fontSize: 24,
                            }}
                        >
                            {item.name}
                        </BodyText>
                    </View>
                </Pressable>
            )}
        />
    )
}
