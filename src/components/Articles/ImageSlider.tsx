import React, { FC, useEffect, useState } from "react"
import { View, Modal, Pressable, Dimensions } from "react-native"
import { usePalette } from "utils/colors"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { deleteSvg as icon } from "assets/modal"
import { NavBar } from "components/NavBar"
import { ZoomableImage } from "./ZoomableImage"
import { useNavigation } from "navigation/NavigationTypes"
import { Easing, useSharedValue, withTiming } from "react-native-reanimated"
import arrow_right from "assets/articles/arrow_right.svg"
import arrow_left from "assets/articles/arrow_left.svg"
import { SliderFluid } from "./SliderFluid"
import { BodyText } from "components/Text"
import { useMounted } from "utils/useMounted"
import { wait } from "utils/functions"
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

    const isMounted = useMounted()

    const screenWidth = Dimensions.get("screen").width

    const { navigate } = useNavigation()

    const deleteSvg = useSVG(icon.svg)
    const arrowRightSvg = useSVG(arrow_right)
    const arrowLeftSvg = useSVG(arrow_left)

    const [imageIndex, setImageIndex] = useState(props.activeIndex)

    useEffect(() => {
        if (isMounted) {
            setImageIndex(props.activeIndex)
        }
    }, [props.activeIndex])
    const source = props.imageSources[imageIndex]

    const scale = useSharedValue(1)
    const savedScale = useSharedValue(1)
    const position = useSharedValue(0)
    const lastPosition = useSharedValue(0)

    const scaleFactorArrow = 1.5
    const scaleFactorX = 1.2

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
                        width: 30 * scaleFactorX,
                        height: 30 * scaleFactorX,
                        backgroundColor: "#ffffff",
                        borderRadius: 15 * scaleFactorX,
                        marginBottom: 8,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Canvas
                        style={{
                            width: icon.width * scaleFactorX,
                            height: icon.heigth * scaleFactorX,
                        }}
                    >
                        {deleteSvg && (
                            <ImageSVG
                                svg={deleteSvg}
                                x={0}
                                y={0}
                                width={icon.width * scaleFactorX}
                                height={icon.heigth * scaleFactorX}
                                transform={[{ scale: scaleFactorX }]}
                            />
                        )}
                    </Canvas>
                </View>
            </Pressable>
            <View
                style={{
                    position: "absolute",
                    width: screenWidth,
                    bottom: 110,
                    zIndex: 2,
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Pressable
                        onPress={() => {
                            scale.value = withTiming(1, { easing: Easing.ease })
                            savedScale.value = 1
                            lastPosition.value = 0
                            position.value = withTiming(0, {
                                easing: Easing.ease,
                            })
                            setImageIndex(
                                (imageIndex - 1 + props.imageSources.length) %
                                    props.imageSources.length
                            )
                        }}
                    >
                        <View
                            style={{
                                width: 24 * scaleFactorArrow,
                                height: 24 * scaleFactorArrow,
                                backgroundColor: "#ffffff",
                                borderRadius: 15 * scaleFactorArrow,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Canvas
                                style={{
                                    width: 24 * scaleFactorArrow,
                                    height: 24 * scaleFactorArrow,
                                }}
                            >
                                {arrowLeftSvg && (
                                    <ImageSVG
                                        svg={arrowLeftSvg}
                                        x={0}
                                        y={0}
                                        width={24 * scaleFactorArrow}
                                        height={24 * scaleFactorArrow}
                                        transform={[
                                            { scale: scaleFactorArrow },
                                        ]}
                                    />
                                )}
                            </Canvas>
                        </View>
                    </Pressable>
                    <SliderFluid
                        currentPos={imageIndex}
                        maxLen={props.imageSources.length}
                    />
                    <Pressable
                        style={{}}
                        onPress={() => {
                            scale.value = withTiming(1, { easing: Easing.ease })
                            savedScale.value = 1
                            lastPosition.value = 0
                            position.value = withTiming(0, {
                                easing: Easing.ease,
                            })
                            setImageIndex(
                                (imageIndex + 1) % props.imageSources.length
                            )
                        }}
                    >
                        <View
                            style={{
                                width: 24 * scaleFactorArrow,
                                height: 24 * scaleFactorArrow,
                                backgroundColor: "#ffffff",
                                borderRadius: 15 * scaleFactorArrow,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Canvas
                                style={{
                                    width: 24 * scaleFactorArrow,
                                    height: 24 * scaleFactorArrow,
                                }}
                            >
                                {arrowRightSvg && (
                                    <ImageSVG
                                        svg={arrowRightSvg}
                                        x={0}
                                        y={0}
                                        width={24 * scaleFactorArrow}
                                        height={24 * scaleFactorArrow}
                                        transform={[
                                            { scale: scaleFactorArrow },
                                        ]}
                                    />
                                )}
                            </Canvas>
                        </View>
                    </Pressable>
                </View>
                <BodyText
                    style={{
                        color: "#fff",
                        fontSize: 20,
                        fontWeight: "200",
                    }}
                >
                    {imageIndex + 1} / {props.imageSources.length}
                </BodyText>
            </View>
            <ZoomableImage
                uri={source}
                style={{ backgroundColor: modalBarrier }}
                position={position}
                lastPosition={lastPosition}
                scale={scale}
                savedScale={savedScale}
            />
            <NavBar
                overrideBackBehavior={async () => {
                    props.onClose()
                    await wait(100)
                    position.value = 0
                    lastPosition.value = 0
                    scale.value = 1
                    savedScale.value = 1
                }}
                overrideHomeBehavior={() => {
                    props.onClose()
                    navigate("Home")
                }}
            />
        </Modal>
    )
}
