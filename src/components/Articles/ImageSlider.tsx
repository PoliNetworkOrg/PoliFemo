import React, { FC, useEffect, useRef, useState } from "react"
import {
    View,
    Modal,
    StyleSheet,
    Pressable,
    Image,
    Dimensions,
    Animated,
    PanResponder,
    PanResponderGestureState,
    GestureResponderEvent,
} from "react-native"
import { usePalette } from "utils/colors"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { deleteSvg as icon } from "assets/modal"

export interface ImageSliderProps {
    imageSources: string[]
    activeIndex: number
    onClose: () => void
    isVisible: boolean
}

// ! Still work in progress !
/**
 *Image Slider.
 *
 */
export const ImageSlider: FC<ImageSliderProps> = props => {
    const { backgroundSecondary, modalBarrier, isLight } = usePalette()

    const deleteSvg = useSVG(icon.svg)

    const source = props.imageSources[props.activeIndex]

    const windowWidth = Dimensions.get("window").width

    const [imageHeight, setImageHeight] = useState(0)

    useEffect(() => {
        if (source) {
            Image.getSize(source, (width, height) => {
                setImageHeight(height * (windowWidth / width))
            })
        }
    }, [source])

    const scale = useRef(new Animated.Value(1)).current
    const pan = useRef(new Animated.Value(0)).current
    let previousLeft = 0

    const handleStartShouldSetPanResponder = (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
    ): boolean => {
        console.log("SHOULD SET PAN RESPONDER")
        return true
    }

    const handleMoveShouldSetPanResponder = (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
    ): boolean => {
        console.log("SHOULD PAN RESPONDER")

        return true
    }

    const handlePanResponderGrant = (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
    ) => {
        console.log("GRANT")
        console.log(event.nativeEvent.locationX)
    }

    const handlePanResponderMove = (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
    ) => {
        const touches = event.nativeEvent.touches
        /* console.log("touches" + touches.length) */
        console.log("touch pos: " + event.nativeEvent.locationX)
        /* event.nativeEvent.changedTouches.forEach(touch =>
            console.log("last pagex " + touch.pageX)
        ) */
        pan.setValue(previousLeft + gestureState.dx)
    }

    const handlePanResponderEnd = (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
    ) => {
        console.log("END PAN")

        previousLeft = previousLeft + gestureState.dx
    }
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
            onPanResponderGrant: handlePanResponderGrant,
            onPanResponderMove: handlePanResponderMove,
            onPanResponderRelease: handlePanResponderEnd,
            onPanResponderTerminate: handlePanResponderEnd,
        })
    )

    return (
        //TODO: animationType fade or slide?
        <Modal
            onRequestClose={props.onClose}
            statusBarTranslucent={true}
            visible={props.isVisible}
            animationType="fade"
            transparent={true}
        >
            <Pressable
                onPress={props.onClose}
                style={{
                    backgroundColor: modalBarrier,
                    flex: 1,
                    justifyContent: "space-around",
                }}
            >
                <View>
                    <Pressable
                        style={{ alignSelf: "flex-end" }}
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
                                marginRight: 16,
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

                    <Pressable
                        // this is a pressable just to prevent the modal from closing when clicking
                        // on the content
                        style={{
                            backgroundColor: backgroundSecondary,
                        }}
                    >
                        <Animated.Image
                            source={{
                                uri: source,
                            }}
                            style={{
                                width: windowWidth,
                                height: imageHeight,

                                transform: [
                                    { scale: scale },
                                    { translateX: pan },
                                ],
                            }}
                            /*  {...panResponder.current.panHandlers} */
                        />
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
    },
})
