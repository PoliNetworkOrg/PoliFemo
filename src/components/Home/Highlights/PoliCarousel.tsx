import React, { FC } from "react"
import { View } from "react-native"
import { CarouselItem } from "utils/carousel"
import { CustomFlatlist } from "./CustomFlatlist"
import { DefaultWidget } from "./DefaultWidget"

/**
 * custom Carousel component, it receives the data to show from the HighlightsManager
 */
export const PoliCarousel: FC<{ dataToShow: CarouselItem[] }> = ({
  dataToShow,
}) => {
  return (
    <View style={{ marginTop: 60 }}>
      {dataToShow === undefined || dataToShow.length === 0 ? (
        //if the widget's list is empty, I display a single default widget!
        <DefaultWidget />
      ) : (
        <CustomFlatlist dataToShow={dataToShow} />
      )}
    </View>
  )
}
