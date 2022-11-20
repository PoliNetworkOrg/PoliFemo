import React, { FC } from "react"
import { ImageBackground, Pressable, View, ViewStyle } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { DarkTitle } from "components/Text"

export interface CardWithGradientProps {
    /**
     * Title in the top-left corner of the card
     */
    title?: string
    /**
     * URL of the image in the background of the card
     */
    imageURL?: string
    /**
     * Function called when the card is clicked
     * @default null
     */
    onClick?: () => void
    /**
     * whether or not to render the title closer to the top-left corner
     * @default true
     */
    closerToCorner?: boolean
    /**
     * Style of the card component
     * @default { marginBottom: 17, borderRadius: 12 }
     */
    style?: ViewStyle
}

/**
 * Component useful to create clickable cards with a background image, a yellowish
 * linear gradient, and a title in the top-left corner.
 *
 * The card can be styled through props.
 */
export const CardWithGradient: FC<CardWithGradientProps> = props => {
    // border radius given to the background image and linear gradient (it matches the border radius of the card)
    const borderRadius =
        props.style && props.style.borderRadius !== undefined
            ? props.style.borderRadius
            : 12

    const closerToCorner = props.closerToCorner ?? true

    // TODO: what is the default image?
    const imageURL =
        props.imageURL ||
        "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"

    return (
        <Pressable
            style={[
                { marginBottom: 17, borderRadius: borderRadius },
                props.style,
            ]}
            onPress={props.onClick ?? null}
        >
            <ImageBackground
                source={{ uri: imageURL }}
                style={{ width: "100%", height: "100%" }}
                imageStyle={{ borderRadius: borderRadius }}
            >
                <LinearGradient
                    colors={[
                        "rgba(255, 181, 68, 0.88)",
                        "rgba(255, 181, 68, 0)",
                    ]}
                    locations={[0, 0.5656]}
                    style={{ flex: 1, borderRadius: borderRadius }}
                >
                    <View style={{ margin: closerToCorner ? 9 : 17 }}>
                        <DarkTitle style={{ lineHeight: 19 }}>
                            {props.title}
                        </DarkTitle>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </Pressable>
    )
}
