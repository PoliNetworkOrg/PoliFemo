import React, { FC } from "react"
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
    onLongPress: () => void
    buttonIcon: ButtonInterface
    isDeleting: boolean
}> = ({ onPress, onLongPress, buttonIcon, isDeleting }) => {
    const { palette } = usePalette()
    const color = palette.primary
    const svg = useSVG(buttonIcon.icon)
    const delIcon = useSVG(deleteIcon)
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
            {isDeleting ? ( //if the prop isDeleting is true
                <Pressable>
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
            ) : undefined}
        </View>
    )
}
