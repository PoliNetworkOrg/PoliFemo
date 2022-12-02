import React from "react"
import { RootStackScreen } from "navigation/NavigationTypes"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { Text } from "components/Text"

import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { deleteSvg as icon } from "assets/modal"
import { useNavigation } from "navigation/NavigationTypes"

export const Error404: RootStackScreen<"Error404"> = () => {
    const { background, homeBackground, primary, isLight } = usePalette()
    const deleteSvg = useSVG(icon.svg)
    const navigation = useNavigation()
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: !isLight ? background : homeBackground,
            }}
        >
            <View
                style={{
                    width: 300,
                    height: 400,
                    backgroundColor: "white",
                    borderRadius: 12,
                    paddingVertical: 12,
                }}
            >
                <Pressable
                    style={{
                        alignSelf: "flex-end",
                        position: "absolute",
                        top: 12,
                        right: 8,
                        zIndex: 1,
                    }}
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <View
                        style={{
                            width: 36,
                            height: 36,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Canvas
                            style={{
                                width: icon.width,
                                height: icon.heigth,
                            }}
                        >
                            {deleteSvg && (
                                <ImageSVG
                                    svg={deleteSvg}
                                    x={0}
                                    y={0}
                                    width={icon.width}
                                    height={icon.heigth}
                                />
                            )}
                        </Canvas>
                    </View>
                </Pressable>
                <Text
                    style={{
                        textAlign: "center",
                        color: isLight ? homeBackground : background,
                        fontSize: 28,
                    }}
                >
                    Error 404
                </Text>
                <View style={{ flex: 1 }} />
                <Text
                    style={{
                        textAlign: "center",
                        color: isLight ? homeBackground : background,
                        fontSize: 22,
                    }}
                >
                    Page not implemented yet
                </Text>
                <View style={{ flex: 1 }} />
            </View>
        </View>
    )
}
