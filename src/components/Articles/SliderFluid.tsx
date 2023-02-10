import React, { FC, useEffect, useRef } from "react"
import { View, Animated } from "react-native"

export interface SliderFluidProps {
    maxLen: number
    currentPos: number
}

/**
 * Temporary Slider
 *
 */
export const SliderFluid: FC<SliderFluidProps> = props => {
    const width = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(width, {
            toValue: (props.currentPos + 1) / props.maxLen,
            duration: 400,
            useNativeDriver: false,
        }).start()
    }, [props.currentPos])

    return (
        <View
            style={{
                width: 100,
                height: 24,
                marginHorizontal: 16,
                borderRadius: 12,
                borderColor: "#fff",
                borderWidth: 1,
                alignItems: "center",
                flexDirection: "row",
                overflow: "hidden",
            }}
        >
            <Animated.View
                style={{
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "#fff",
                    width: width.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                    }),
                }}
            ></Animated.View>
        </View>
    )
}
