import React, { FC, useState } from "react"
import { ImageSourcePropType, Pressable, View } from "react-native"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"

import { BodyText } from "components/Text"
import { usePalette } from "utils/colors"
import deleteIcon from "assets/menu/delete.svg"

export interface ButtonInterface {
    id: number
    title: string
    icon: ImageSourcePropType
}

/**
 * single buttons for the main menu, with custom icons and titles
 */
export const MenuButton: FC<{
    onPress: () => void
    buttonIcon: ButtonInterface
    onLongPress?: () => void
    isFocused: boolean
    handleFeatures?: () => void
}> = ({ onPress, onLongPress, buttonIcon, isFocused, handleFeatures }) => {
    const { palette } = usePalette()
    const color = palette.primary
    const svg = useSVG(buttonIcon.icon)
    const delIcon = useSVG(deleteIcon)

    const [isDeleting, set] = useState(false)
    return (
        <View>
            <Pressable onPress={onPress} onLongPress={onLongPress}>
                <View
                    style={{
                        width: 84,
                        height: 70,
                        backgroundColor: color,
                        paddingVertical: 7,
                        marginHorizontal: 6,
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 10,
                        marginTop: 8, //added margin to the top due to the deleting operation
                        display: isDeleting ? "none" : "flex",
                    }}
                >
                    <Canvas style={{ flex: 1, width: 40 }}>
                        {svg && (
                            <ImageSVG
                                svg={svg}
                                x={0}
                                y={0}
                                width={40}
                                height={38}
                            />
                        )}
                    </Canvas>
                    <BodyText
                        style={{
                            fontSize: 10,
                            color: "white",
                        }}
                    >
                        {buttonIcon.title}
                    </BodyText>
                </View>
            </Pressable>
            {isFocused ? ( //if the prop isFocused is true
                <>
                    {buttonIcon.title != "Aggiungi" && (
                        <Pressable
                            onPress={() => {
                                set(!isDeleting)
                                handleFeatures()
                            }}
                        >
                            <View
                                style={{
                                    position: "absolute",
                                    width: 25,
                                    height: 25,
                                    right: 0,
                                    bottom: 53,
                                }}
                            >
                                <Canvas style={{ flex: 1, width: 27 }}>
                                    {delIcon && (
                                        <ImageSVG
                                            svg={delIcon}
                                            x={0}
                                            y={0}
                                            width={25}
                                            height={25}
                                        />
                                    )}
                                </Canvas>
                            </View>
                        </Pressable>
                    )}
                </>
            ) : undefined}
        </View>
    )
}
