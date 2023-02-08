import React from "react"
import { FC, useState } from "react"
import { Dimensions, Image, View, ViewStyle } from "react-native"
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler"
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated"

interface ZoomableImageProps {
    uri: string
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

    const scale = useSharedValue(1)
    const savedScale = useSharedValue(1)
    const position = useSharedValue(0)
    const lastPosition = useSharedValue(0)

    const pinchGesture = Gesture.Pinch()
        .onUpdate(e => {
            scale.value = savedScale.value * e.scale
        })
        .onEnd(() => {
            if (scale.value > 1) {
                savedScale.value = scale.value
            } else {
                savedScale.value = 1
                scale.value = withSpring(1)
                lastPosition.value = 0
                position.value = withSpring(0)
            }
        })

    const panGesture = Gesture.Pan()
        .onUpdate(e => {
            if (scale.value >= 1) {
                position.value =
                    e.translationX / scale.value + lastPosition.value
            }
        })
        .onEnd(() => {
            if (scale.value >= 1) {
                lastPosition.value = position.value
                const delta =
                    (fullWidth * (scale.value - 1)) / (2 * scale.value)

                if (position.value > 0 && position.value > delta) {
                    position.value = withSpring(delta)
                    lastPosition.value = delta
                } else if (
                    position.value < 0 &&
                    Math.abs(position.value) > delta
                ) {
                    position.value = withSpring(-delta)
                    lastPosition.value = -delta
                }
            }
        })

    const composed = Gesture.Simultaneous(pinchGesture, panGesture)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { translateX: position.value }],
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
