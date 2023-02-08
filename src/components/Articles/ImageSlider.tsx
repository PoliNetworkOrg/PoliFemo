import React, { FC } from "react"
import { View, Modal, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { deleteSvg as icon } from "assets/modal"
import { NavBar } from "components/NavBar"
import { ZoomableImage } from "./ZoomableImage"
import { useNavigation } from "navigation/NavigationTypes"

export interface ImageSliderProps {
    imageSources: string[]
    activeIndex: number
    onClose: () => void
    isVisible: boolean
}

/**
 *Image Slider (still work in progress).
 *
 */
export const ImageSlider: FC<ImageSliderProps> = props => {
    const { modalBarrier } = usePalette()

    const deleteSvg = useSVG(icon.svg)

    const source = props.imageSources[props.activeIndex]

    const { navigate } = useNavigation()

    return (
        <Modal
            onRequestClose={props.onClose}
            statusBarTranslucent={true}
            visible={props.isVisible}
            animationType="fade"
            transparent={true}
        >
            <Pressable
                style={{
                    alignSelf: "flex-end",
                    position: "absolute",
                    zIndex: 2,
                    top: 48,
                    left: 32,
                }}
                onPress={() => props.onClose()}
            >
                <View
                    style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "#ffffff",
                        borderRadius: 15,
                        marginBottom: 8,
                        justifyContent: "center",
                        alignItems: "center",
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
            <ZoomableImage
                uri={source}
                style={{ backgroundColor: modalBarrier }}
            />
            <NavBar
                overrideBackBehavior={props.onClose}
                overrideHomeBehavior={() => {
                    props.onClose()
                    navigate("Home")
                }}
            />
        </Modal>
    )
}
