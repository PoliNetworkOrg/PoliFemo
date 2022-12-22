import React, { FC } from "react"
import { View } from "react-native"

import { TagWithData } from "./NewsManager"
import { CardWithGradient } from "components/CardWithGradient"
import { useNavigation } from "navigation/NavigationTypes"

interface NewsTagsGridProps {
    /**
     * Tags to be displayed
     */
    tags: TagWithData[]
    /**
     * Callback function used to update the state in the NewsManager when the preference
     * of a tag changes (whether it is favourite or not)
     */
    updateFavourites: (tagName: string, favourite: boolean) => void
}

/**
 * Component used to display a grid containing the tags (news categories)
 * inside of the news bottom sheet in the home page.
 */
export const NewsTagsGrid: FC<NewsTagsGridProps> = props => {
    const navigation = useNavigation()

    // Function used when displaying a tag card
    const getTagCard = (tag: TagWithData, index: number) => {
        return (
            <CardWithGradient
                key={index}
                title={tag.name}
                imageURL={tag.image}
                onClick={() =>
                    navigation.navigate("ArticlesList", {
                        tagName: tag.name,
                        isFavourite: tag.isFavourite,
                        onFavouriteChange: favourite =>
                            props.updateFavourites(tag.name, favourite),
                    })
                }
                closerToCorner={true}
                style={{ height: tag.height }}
            />
        )
    }

    return (
        <>
            {props.tags.length === 1 ? (
                // if there is only 1 news tag, display its card at full width
                getTagCard(props.tags[0], 0)
            ) : (
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 17, marginRight: 17 }}>
                        {props.tags
                            .filter(tag => tag.column === "left")
                            .map((tag, index) => getTagCard(tag, index))}
                    </View>

                    <View style={{ flex: 14 }}>
                        {props.tags
                            .filter(tag => tag.column === "right")
                            .map((tag, index) => getTagCard(tag, index))}
                    </View>
                </View>
            )}
        </>
    )
}
