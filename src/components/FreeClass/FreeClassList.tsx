import { useSVG, Canvas, ImageSVG } from "@shopify/react-native-skia"
import { BodyText } from "components/Text"
import React, { FC } from "react"
import { FlatList, View, Pressable, Dimensions } from "react-native"
import { usePalette } from "utils/colors"
import timerIcon from "assets/freeClassrooms/timer.svg"
import overcrowdingIcon from "assets/freeClassrooms/overcrowding.svg"

const { width } = Dimensions.get("window")

const data: string[] = ["B2.1.1", "B3.1.1", "B4.1.1", "B5.1.1"]

export const FreeClassList: FC = () => {
    const { primary } = usePalette()
    const timerSVG = useSVG(timerIcon)
    const overcrowdingSVG = useSVG(overcrowdingIcon)

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
            data={data}
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
                    <Canvas
                        style={{
                            flex: 1,
                            width: 28,
                            alignSelf: "center",
                            marginTop: 12,
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
                    <Canvas
                        style={{
                            flex: 1,
                            width: 24,
                            alignSelf: "flex-end",
                            marginRight: 14,
                            marginTop: 14,
                        }}
                    >
                        {overcrowdingSVG && (
                            <ImageSVG
                                svg={overcrowdingSVG}
                                x={0}
                                y={0}
                                width={24}
                                height={19}
                            />
                        )}
                    </Canvas>
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
                            {item}
                        </BodyText>
                    </View>
                </Pressable>
            )}
        />
    )
}
