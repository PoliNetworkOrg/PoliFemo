import { BodyText } from "components/Text"
import React, { FC } from "react"
import { View, Dimensions, ImageBackground } from "react-native"
import lecturesImage from "assets/carousel-lectures.png"
import { useNavigation } from "navigation/NavigationTypes"
import { CarouselItem } from "utils/carousel"
import { CustomFlatlist } from "./CustomFlatlist"

const { width } = Dimensions.get("window")

/**
 * custom Carousel component, it receives the data to show from the HighlightsManager
 */
export const PoliCarousel: FC<{ dataToShow: CarouselItem[] }> = ({
    dataToShow,
}) => {
    const { navigate } = useNavigation()

    return (
        <View style={{ marginTop: 60 }}>
            {dataToShow === undefined || dataToShow.length === 0 ? (
                //if the widget's list is empty, I display a single default widget!
                <View
                    style={{
                        width,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ImageBackground
                        style={{
                            width: width - 80,
                            height: 77,
                            borderRadius: 10,
                            overflow: "hidden",
                        }}
                        source={lecturesImage} //we need a default image!
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
                                Non ci sono novità
                            </BodyText>
                        </View>
                    </ImageBackground>
                </View>
            ) : (
                <CustomFlatlist dataToShow={dataToShow} />
            )}
        </View>
    )
}
