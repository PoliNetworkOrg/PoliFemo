import React, { FC } from "react"
import { View } from "react-native"
import { PoliCarousel } from "./PoliCarousel"

/**
 * Component that decides the content of the carousel.
 * In the future the logic bheind the highlights will be implemented here and it will pass
 * the correct data to the PolimiCarousel
 */
export const HighlightsManager: FC = () => {
    return (
        <View>
            <PoliCarousel />
        </View>
    )
}
