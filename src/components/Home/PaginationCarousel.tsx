import React, { FC } from "react"
import Animated, { Extrapolate } from "react-native-reanimated"
import { View, Dimensions } from "react-native"
import { CarouselItem } from "./HighlightsManager"

const { width } = Dimensions.get("window")

/**
 * Custom Pagination component to handle the animation of the dots
 */
export const PaginationCarousel: FC<{
    dataToShow: CarouselItem[]
    scrollX: Animated.Value<number>
    currentIndex: number
}> = ({ dataToShow, scrollX, currentIndex }) => {
    return (
        <View style={{ marginTop: 24 }}>
            <Animated.FlatList
                data={dataToShow}
                keyExtractor={(_, idx) => idx.toString()}
                horizontal
                bounces={false}
                style={{
                    flexDirection: "row",
                    alignSelf: "center",
                }}
                renderItem={({ index }) => {
                    const inputRange = [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                    ]

                    const scaleOutputRange = [0.5, 1, 0.5]
                    const opacityOutputRange = [0.2, 1, 0.2]

                    const dotScale = scrollX.interpolate({
                        inputRange,
                        outputRange: scaleOutputRange,
                        extrapolate: Extrapolate.CLAMP,
                    })

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: opacityOutputRange,
                        extrapolate: Extrapolate.CLAMP,
                    })

                    return (
                        <View
                            style={{
                                width: 11,
                            }}
                        >
                            <Animated.View
                                style={{
                                    width: 11,
                                    height: 11,
                                    borderRadius: 7,
                                    backgroundColor:
                                        index === currentIndex
                                            ? "#FFB544"
                                            : "#8791BD",
                                    opacity:
                                        index === currentIndex ? opacity : 1,
                                    transform: [
                                        {
                                            scale: dotScale,
                                        },
                                    ],
                                }}
                            />
                        </View>
                    )
                }}
            ></Animated.FlatList>
        </View>
    )
}
