import React, { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { api, RetryType, Tag, Article } from "api"
import { NewsBottomSheet } from "./NewsBottomSheet"
import { newsTagsPatterns, CardsPattern } from "utils/cardsPatterns"

export type TagWithData = Tag & {
    /** The column in which the card has to be inserted */
    column: "left" | "right"
    /** The height of the card */
    height: number
    /** Whether the tag is favourite or not */
    isFavourite: boolean
    /** Image used if the tag had no primary image */
    reserveImage?: string
}

/**
 * Interface of an object that maps a tag name to whether that tag is favourite or not
 *
 * TODO: use tag id if there will be one
 */
export interface Favourites {
    [key: string]: boolean
}

/**
 * Interface of an object that maps a tag name to an article
 *
 * TODO: use tag id if there will be one
 */
export interface LastArticles {
    [key: string]: Article
}

/**
 * Bottom sheet in the home page to access the news.
 *
 * This is the component that retrieves and precesses the news content.
 * Afterwards, it passes the data to the NewsBottomSheet.
 */
export const NewsManager = () => {
    const [tags, setTags] = useState<Tag[]>([])
    const [favourites, setFavourites] = useState<Favourites>({})
    const [lastArticles, setLastArticles] = useState<LastArticles>({})

    // TODO: sicuro di lasciare no retry?
    // TODO: se backend mette sempre foto per i tag, eliminare questa logica
    const getLastArticles = async (list: Tag[]) => {
        const tempLastArticles: LastArticles = {}
        for (const tag of list) {
            const article = await api.getLastArticlByTag(tag.name, {
                retryType: RetryType.NO_RETRY,
            })
            tempLastArticles[tag.name] = article
        }
        return tempLastArticles
    }

    useEffect(() => {
        console.log("Loading favourite tags from storage")
        AsyncStorage.getItem("newstags:favourite")
            .then(favouritesJSON => {
                if (favouritesJSON) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const data: Favourites = JSON.parse(favouritesJSON)
                    setFavourites(data)
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        // Load tags (news categories) and their last article (one for each tag)
        const fetchData = async () => {
            const testTags = [
                { name: "TEST 1", image: "" },
                { name: "TEST 2", image: "" },
                { name: "TEST 3", image: "" },
                { name: "TEST 4", image: "" },
                { name: "TEST 5", image: "" },
                { name: "TEST 6", image: "" },
                { name: "TEST 7", image: "" },
                { name: "TEST 8", image: "" },
                { name: "TEST 9", image: "" },
            ]
            const tempTags = await api.getTags()
            const tempLastArticles = await getLastArticles(tempTags)
            setTags([...tempTags, ...testTags])
            setLastArticles(tempLastArticles)
        }
        fetchData().catch(err => console.log(err))
    }, [])

    // Function that calculates heights and columns of the tag cards using hardcoded patterns.
    // Then it returns a new list of tags with that and other usefull data.
    const getTagsWithData = (favourite: boolean) => {
        const tempTagsWithData: TagWithData[] = []
        const tagsToShow = tags.filter(tag => {
            if (!favourite) {
                return favourites[tag.name] === false
            } else {
                // If undefined, the tag is marked as favourite by default
                return favourites[tag.name] !== false
            }
        })
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
                    height: height,
                    isFavourite: favourite,
                    reserveImage: lastArticles[tagsToShow[index].name]?.image,
                })
                index++
                remaining--
            }
        }

        return tempTagsWithData
    }

    //TODO review this function
    //TODO prendere solo da categorie preferite
    //TODO se non ci sono categorie preferite, prendere il più recente
    //TODO forse usare max function
    const getHighlightArticle = () => {
        let tempHighlight: Article | undefined = undefined
        for (const tag of tags) {
            if (!tempHighlight) {
                tempHighlight = lastArticles[tag.name]
            } else {
                const article = lastArticles[tag.name]
                const lastDate = new Date(tempHighlight.publish_time)
                const date = new Date(article?.publish_time)
                if (
                    (!tempHighlight.image && article.image) || // TODO pensare se articolo in evidenza deve per forza avere un immagine
                    date.getTime() > lastDate.getTime()
                ) {
                    tempHighlight = article
                }
            }
        }
        return tempHighlight as Article
    }

    return (
        <NewsBottomSheet
            favouriteTags={getTagsWithData(true)}
            otherTags={getTagsWithData(false)}
            highlightArticle={getHighlightArticle()}
            updateFavourites={(categoryName, favourite) => {
                const tempFavourites = { ...favourites }
                tempFavourites[categoryName] = favourite
                setFavourites(tempFavourites)
            }}
        />
    )
}
