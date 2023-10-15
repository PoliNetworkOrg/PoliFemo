import { BodyText } from "components/Text"
import { FC, useState, useCallback } from "react"
import {
  View,
  Dimensions,
  Pressable,
  ImageBackground,
  ViewToken,
} from "react-native"
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated"
import { PaginationCarousel } from "./PaginationCarousel"
import iseeImage from "assets/highlights/isee.png"
import lecturesImage from "assets/highlights/lectures.png"
import deadlineImage from "assets/highlights/deadline.png"
import reminderImage from "assets/highlights/reminder.png"
import { useNavigation } from "navigation/NavigationTypes"
import { CarouselItem, formatTitle } from "utils/carousel"
import { Divider } from "components/Divider"

const { width } = Dimensions.get("window")

const widgetImages = [
  lecturesImage,
  deadlineImage,
  reminderImage,
  iseeImage,
  reminderImage,
]

export const CustomFlatlist: FC<{ dataToShow: CarouselItem[] }> = ({
  dataToShow,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const scrollX = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x
  })

  const handleViewableItemsChanged = useCallback(
    ({ changed }: { changed: ViewToken[] }) => {
      if (changed[0].isViewable && changed[0].index) {
        setCurrentIndex(changed[0].index)
      }
    },
    []
  )

  const { navigate } = useNavigation()

  return (
    <>
      <Animated.FlatList
        data={dataToShow}
        keyExtractor={(_, index) => index.toString()}
        bounces={true}
        pagingEnabled={true}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        renderItem={({ item }) => {
          return (
            <Pressable
              style={{
                width,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigate("Error404")}
            >
              <View
                style={{
                  width: width - 80,
                  height: 77,
                }}
              >
                <ImageBackground
                  style={{
                    width: width - 80,
                    height: 77,
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                  source={widgetImages[item.type - 1]}
                >
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      margin: 10,
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
                      {formatTitle(item.title)}
                    </BodyText>
                  </View>
                </ImageBackground>
              </View>
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
                <View>
                  <BodyText
                    style={{
                      fontWeight: "700",
                      marginLeft: 2,
                      fontSize: 12,
                    }}
                  >
                    {item.date}
                    {"          "}
                    {item.time}
                  </BodyText>
                </View>
                <View>
                  <BodyText
                    style={{
                      fontWeight: "400",
                      marginRight: 2,
                      marginLeft: 15,
                      fontSize: 12,
                      maxWidth: 110,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.room}
                  </BodyText>
                </View>
              </View>
              <Divider style={{ marginTop: 12, width: width - 80 }} />
            </Pressable>
          )
        }}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        onViewableItemsChanged={handleViewableItemsChanged}
      />
      <PaginationCarousel
        dataToShow={dataToShow}
        scrollX={scrollX}
        currentIndex={currentIndex}
      />
    </>
  )
}
