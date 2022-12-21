import React, { FC, useState, useEffect } from "react"
import { View, Button } from "react-native"

import { CardWithGradient } from "components/CardWithGradient"
import { Tag, Article } from "api"
import { useNavigation } from "navigation/NavigationTypes"
import { newsTagsPatterns, CardsPattern } from "utils/cardsPatterns"

export type TagWithData = Tag & {
    column: "left" | "right"
    cardHeight: number
}

export interface Favourites {
    [key: string]: boolean
}
export interface LastArticles {
    [key: string]: Article
}

interface NewsTagsGridProps {
    tags: Tag[]
    favourites: Favourites
    lastArticles: LastArticles
    updateFavourites: (tagName: string, favourite: boolean) => void
}

/**
 * Component used to display a grid containing the highlight article and
 * the news tags (categories) inside of the news bottom sheet in the home page.
 */
export const NewsTagsGrid: FC<NewsTagsGridProps> = props => {
    const navigation = useNavigation()

    const [tagsWithData, setTagsWithData] = useState<TagWithData[]>([])
    // Wether to show only favourite tags (true) or only other tags (false)
    const [seeFavourites, setSeeFavourites] = useState<boolean>(true)

    const [lastArticle, setLastArticle] = useState<Article>()

    // Uuse hardcoded patterns to get heights and positions (left / right) of the cards
    useEffect(() => {
        console.log("Updating categories with data")
        const tempTagsWithData: TagWithData[] = []

        const tagsToShow = props.tags.filter(
            tag =>
                props.favourites[tag.name] === seeFavourites ||
                props.favourites[tag.name] === undefined
        )

        // store the pattern data of the current batch of cards
        let pattern: CardsPattern
        // index of the current news tag
        let index = 0
        // number of tags remaining
        let remaining = tagsToShow.length

        while (index < tagsToShow.length) {
            // choose the dimension of the next batch of tags and get the corresponding pattern
            if (index === 0) {
                // When first bacth
                if (remaining <= 6) {
                    pattern = newsTagsPatterns.first[remaining]
                } else {
                    pattern = newsTagsPatterns.first[4]
                }
            } else {
                // When other batches. Here it is never possible that remaining === 1 or remaining === 2
                if (remaining % 5 === 1 || remaining % 5 === 3) {
                    pattern = newsTagsPatterns.other[3]
                } else if (remaining % 5 === 2 || remaining % 5 === 4) {
                    pattern = newsTagsPatterns.other[4]
                } else {
                    pattern = newsTagsPatterns.other[5]
                }
            }

            for (const [height, column] of pattern) {
                tempTagsWithData.push({
                    ...tagsToShow[index],
                    column: column,
                    cardHeight: height,
                })
                index++
                remaining--
            }
        }
        setTagsWithData(tempTagsWithData)
    }, [props.tags, props.favourites, seeFavourites])

    // Function used when displaying the cards
    const getTagCard = (tag: TagWithData, index: number) => {
        const image =
            tag.image && tag.image.length > 0
                ? tag.image
                : props.lastArticles[tag.name].image
        return (
            <CardWithGradient
                key={index}
                title={tag.name}
                imageURL={image}
                onClick={() =>
                    navigation.navigate("ArticlesList", {
                        tagName: tag.name,
                        isFavourite: props.favourites[tag.name] ?? true,
                        onFavouriteChange: favourite =>
                            props.updateFavourites(tag.name, favourite),
                    })
                }
                closerToCorner={true}
                style={{ height: tag.cardHeight }}
            />
        )
    }

    //TODO review this function
    //TODO prendere solo da categorie preferite
    //TODO se non ci sono categorie preferite, prendere il più recente
    //TODO forse usare max function
    useEffect(() => {
        let tempLast: Article | undefined = undefined
        for (const tag of props.tags) {
            if (!tempLast) {
                tempLast = props.lastArticles[tag.name]
            } else {
                const article = props.lastArticles[tag.name]
                const lastDate = new Date(tempLast.publish_time)
                const date = new Date(article.publish_time)
                if (
                    (!tempLast.image && article.image) || // TODO pensare se articolo in evidenza deve per forza avere un immagine
                    date.getTime() > lastDate.getTime()
                ) {
                    tempLast = article
                }
            }
        }
        setLastArticle(tempLast)
    }, [props.tags, props.lastArticles])

    return (
        <View style={{ paddingBottom: 120 }}>
            <>
                {lastArticle && (
                    <CardWithGradient
                        title={lastArticle.title}
                        imageURL={lastArticle.image}
                        onClick={() =>
                            navigation.navigate("Article", {
                                article: lastArticle,
                            })
                        }
                        style={{ height: 220 }}
                    />
                )}
                {tagsWithData.length === 1 ? (
                    // if there is only 1 news tag, display its card at full width
                    getTagCard(tagsWithData[0], 0)
                ) : (
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 17, marginRight: 17 }}>
                            {tagsWithData
                                .filter(tag => tag.column === "left")
                                .map((tag, index) => getTagCard(tag, index))}
                        </View>

                        <View style={{ flex: 14 }}>
                            {tagsWithData
                                .filter(tag => tag.column === "right")
                                .map((tag, index) => getTagCard(tag, index))}
                        </View>
                    </View>
                )}
                <Button
                    title={
                        seeFavourites
                            ? "Altre categorie"
                            : "Categorie preferite"
                    }
                    onPress={() => {
                        setSeeFavourites(value => !value)
                    }}
                />
            </>
        </View>
    )
}
