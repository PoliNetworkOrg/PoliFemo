import React from "react"
import { FC, useState } from "react"
import { Dimensions, Image, View, ViewStyle } from "react-native"
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler"
import Animated, {
    SharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated"

interface ZoomableImageProps {
    uri: string
    position: SharedValue<number>
    lastPosition: SharedValue<number>
    scale: SharedValue<number>
    savedScale: SharedValue<number>
    style?: ViewStyle
}

/**
 * Composite Gestures (pan and zoom) made with Reanimated.
 *
 * docs: https://docs.swmansion.com/react-native-gesture-handler/docs/2.3.0/gesture-composition
 */
export const ZoomableImage: FC<ZoomableImageProps> = props => {
    const fullWidth = Dimensions.get("screen").width
    const [height, setHeight] = useState(0)

    Image.getSize(props.uri, (width, height) => {
        setHeight((height * fullWidth) / width)
    })

    const pinchGesture = Gesture.Pinch()
        .onUpdate(e => {
            props.scale.value = props.savedScale.value * e.scale
        })
        .onEnd(() => {
            if (props.scale.value > 1) {
                props.savedScale.value = props.scale.value
            } else {
                props.savedScale.value = 1
                props.scale.value = withSpring(1)
                props.lastPosition.value = 0
                props.position.value = withSpring(0)
            }
        })

    const panGesture = Gesture.Pan()
        .onUpdate(e => {
            if (props.scale.value >= 1) {
                props.position.value =
                    e.translationX / props.scale.value +
                    props.lastPosition.value
            }
        })
        .onEnd(() => {
            if (props.scale.value >= 1) {
                props.lastPosition.value = props.position.value
                const delta =
                    (fullWidth * (props.scale.value - 1)) /
                    (2 * props.scale.value)

                if (props.position.value > 0 && props.position.value > delta) {
                    props.position.value = withSpring(delta)
                    props.lastPosition.value = delta
                } else if (
                    props.position.value < 0 &&
                    Math.abs(props.position.value) > delta
                ) {
                    props.position.value = withSpring(-delta)
                    props.lastPosition.value = -delta
                }
            }
        })

    const composed = Gesture.Simultaneous(pinchGesture, panGesture)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: props.scale.value },
            { translateX: props.position.value },
        ],
    }))
    return (
        <View
            style={[
                {
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                },
                props.style,
            ]}
        >
            <GestureHandlerRootView>
                <GestureDetector gesture={composed}>
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                        }}
                    >
                        <Animated.Image
                            source={{
                                uri: props.uri,
                            }}
                            style={[
                                {
                                    width: fullWidth,
                                    height: height,
                                },
                                animatedStyle,
                            ]}
                        />
                    </View>
                </GestureDetector>
            </GestureHandlerRootView>
        </View>
    )
}
