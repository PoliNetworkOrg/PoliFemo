import React, { FC } from "react"
import { TextInput, View, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import icon from "assets/menu/search.svg"

/**
 * butterblablabla
 */
export const PoliSearchBar: FC<{
    onPress: () => void
}> = ({ onPress }) => {
    const { palette } = usePalette()
    const svg = useSVG(icon)
    const color = palette.primary
    return (
        <View
            style={{
                marginVertical: 46,
                marginHorizontal: 52,
                borderRadius: 28,
                backgroundColor: "#F6F7FC",
                justifyContent: "space-between",
                flexDirection: "row",
            }}
        >
            <TextInput
                style={{
                    paddingVertical: 10,
                    paddingLeft: 18,
                    color: color,
                }}
                autoCorrect={true}
                placeholder="Cerca"
                selectionColor={color}
                maxLength={32}
                onSubmitEditing={onPress}
            />
            <View
                style={{
                    paddingVertical: 10,
                    paddingRight: 18,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Pressable onPress={onPress}>
                    <Canvas
                        style={{
                            width: 22,
                            height: 22,
                        }}
                    >
                        {svg && (
                            <ImageSVG
                                svg={svg}
                                x={0}
                                y={0}
                                width={22}
                                height={22}
                            />
                        )}
                    </Canvas>
                </Pressable>
            </View>
        </View>
    )
}
