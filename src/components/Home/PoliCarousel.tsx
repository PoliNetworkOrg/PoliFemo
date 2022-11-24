import React, { FC, useState, useRef } from "react"
import { View, Image, Dimensions } from "react-native"
import Animated from "react-native-reanimated"
import { PaginationCarousel } from "./PaginationCarousel"

//just to test with same data
export interface CarouselItem {
    id: number
    color: string
}
const data: CarouselItem[] = [
    { id: 0, color: "red" },
    { id: 1, color: "blue" },
    { id: 2, color: "yellow" },
    { id: 3, color: "cyan" },
    { id: 4, color: "green" },
]

const { width } = Dimensions.get("window")

/**
 * custom Carousel component
 */
export const PoliCarousel: FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const scrollX = useRef(new Animated.Value(0)).current

    //questa parte funziona ma non va bene scritta cosi
    const handleViewableItemsChanged = useRef(
        ({ changed }: { changed: any }) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (changed[0].isViewable) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                setCurrentIndex(changed[0].index)
            }
        }
    ).current

    const viewAbilityConfig = { viewAreaCoveragePercentThreshold: 65 }

    return (
        <View
            style={{
                position: "absolute",
                marginTop: 245,
            }}
        >
            <Animated.FlatList
                data={data}
                keyExtractor={(_, index) => index.toString()}
                bounces={true}
                pagingEnabled={true}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: { x: scrollX },
                            },
                        },
                    ],
                    { useNativeDriver: false }
                )}
                renderItem={({ item }) => {
                    return (
                        <View
                            style={{
                                width,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                style={{
                                    width: width - 40,
                                    height: 77,
                                    backgroundColor: item.color,
                                    borderRadius: 10,
                                }}
                            ></Image>
                        </View>
                    )
                }}
                viewabilityConfig={viewAbilityConfig}
                onViewableItemsChanged={handleViewableItemsChanged}
            ></Animated.FlatList>

            <PaginationCarousel
                data={data}
                scrollX={scrollX}
                currentIndex={currentIndex}
            />
        </View>
    )
}
