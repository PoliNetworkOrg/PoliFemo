import React, { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated"
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler"

interface CrowdSliderDynamicProps {
    isSlidable?: boolean
    onSlided?: () => void
}

export const CrowdSliderDynamic: FC<CrowdSliderDynamicProps> = props => {
    const { isLight } = usePalette()

    const position = useSharedValue(0)
    const lastPosition = useSharedValue(0)
    const panGesture = Gesture.Pan()
        .onUpdate(e => {
            console.log("update")
            position.value = e.translationX + lastPosition.value
        })
        .onEnd(() => {
            lastPosition.value = position.value
        })

    const animatedPos = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
    }))
    return (
        <View>
            <View
                style={{
                    borderBottomWidth: 0.5,
                    width: "100%",
                    borderColor: isLight ? "#454773" : "#fff",
                    marginTop: 15,
                    marginBottom: 18,
                }}
            >
                <GestureHandlerRootView>
                    <GestureDetector gesture={panGesture}>
                        <Animated.View
                            style={[
                                {
                                    position: "absolute",
                                    width: 28,
                                    height: 28,
                                    backgroundColor: "#D9D9D9",
                                    borderRadius: 14,
                                    top: -14,
                                },
                                animatedPos,
                            ]}
                        />
                    </GestureDetector>
                </GestureHandlerRootView>
            </View>
        </View>
    )
}
