import React, { FC } from "react"
import { TextInput, View } from "react-native"
import { usePalette } from "utils/colors"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import icon from "assets/menu/search.svg"

/**
 * butterblablabla
 */
export const PoliSearchBar: FC = () => {
    const { palette } = usePalette()
    const svg = useSVG(icon)
    return (
        <View
            style={{
                marginVertical: 46,
                marginHorizontal: 52,
                borderRadius: 28,
                backgroundColor: "#F6F7FC",
            }}
        >
            <View
                style={{
                    marginVertical: 10,
                    marginHorizontal: 18,
                }}
            >
                <TextInput
                    autoCorrect={true}
                    placeholder="Cerca"
                    selectionColor={palette.primary}
                />
                <Canvas style={{ flex: 1, width: 22, alignSelf: "flex-end" }}>
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
            </View>
        </View>
    )
}
