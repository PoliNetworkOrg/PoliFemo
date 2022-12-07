import { BodyText } from "components/Text"
import React, { FC, useState, useRef } from "react"
import { View, Dimensions, Pressable, ImageBackground } from "react-native"
import Animated from "react-native-reanimated"
import { PaginationCarousel } from "./PaginationCarousel"
import lecturesImage from "assets/carousel-lectures.png"
import iseeImage from "assets/carousel-isee.png"
import { CarouselItem } from "./HighlightsManager"

const { width } = Dimensions.get("window")

/**
 * enum to differentiate the different types of widget we could have
 * different widget types have different background images
 */
export enum WidgetType {
    LECTURES,
    ISEE,
}

/**
 * custom Carousel component, it receives the data to show from the HighlightsManager
 */
export const PoliCarousel: FC<{ dataToShow: CarouselItem[] }> = ({
    dataToShow,
}) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const scrollX = useRef(new Animated.Value(0)).current

    //questa parte funziona ma non va bene scritta cosi
    const handleViewableItemsChanged = useRef(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ changed }: { changed: any }) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (changed[0].isViewable) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                setCurrentIndex(changed[0].index)
            }
        }
    ).current

    const viewAbilityConfig = { viewAreaCoveragePercentThreshold: 50 }

    return (
        <View style={{ marginTop: 60 }}>
            <Animated.FlatList
                data={dataToShow}
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
                        <View>
                            <Pressable
                                style={{
                                    width,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onPress={() =>
                                    console.log("Highlights premuto!")
                                }
                            >
                                <ImageBackground
                                    style={{
                                        width: width - 80,
                                        height: 77,
                                        borderRadius: 10,
                                        overflow: "hidden",
                                    }}
                                    source={
                                        item.type === WidgetType.LECTURES
                                            ? lecturesImage
                                            : iseeImage
                                    }
                                >
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            margin: 15,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <BodyText
                                            style={{
                                                fontWeight: "900",
                                                color: "white",
                                                fontSize: 20,
                                                textAlign: "center",
                                            }}
                                        >
                                            {item.title}
                                        </BodyText>
                                    </View>
                                </ImageBackground>
                            </Pressable>
                            <View
                                //this view represents the text under the highlights
                                style={{
                                    marginTop: 12,
                                    width: width - 80,
                                    justifyContent: "space-between",
                                    alignSelf: "center",
                                    flexDirection: "row",
                                }}
                            >
                                <Pressable>
                                    <BodyText
                                        style={{
                                            fontWeight: "700",
                                            marginLeft: 2,
                                        }}
                                    >
                                        {item.date}
                                        {"          "}
                                        {item.time}
                                    </BodyText>
                                </Pressable>
                                <Pressable>
                                    <BodyText
                                        style={{
                                            fontWeight: "700",
                                            marginRight: 2,
                                        }}
                                    >
                                        {item.room}
                                    </BodyText>
                                </Pressable>
                            </View>
                            <View
                                //this view represents the line of separation
                                style={{
                                    width: width - 80,
                                    marginTop: 12,
                                    justifyContent: "center",
                                    alignSelf: "center",
                                    borderBottomColor: "#8791BD",
                                    borderBottomWidth: 1,
                                }}
                            />
                        </View>
                    )
                }}
                viewabilityConfig={viewAbilityConfig}
                onViewableItemsChanged={handleViewableItemsChanged}
            />
            <PaginationCarousel
                dataToShow={dataToShow}
                scrollX={scrollX}
                currentIndex={currentIndex}
            />
        </View>
    )
}
