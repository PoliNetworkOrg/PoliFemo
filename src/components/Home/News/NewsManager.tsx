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
}

/**
 * Interface of an object that maps a tag name to whether that tag is favourite or not
 *
 * TODO: use tag id if and when there will be one
 */
export interface Favourites {
    [key: string]: boolean
}

/**
 * Interface of an object that maps a tag name to an article.
 *
 * TODO: use tag id if and when there will be one
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
    const [lastArticles, setLastArticles] = useState<LastArticles>(
        {} as LastArticles
    )

    // TODO: sicuro di lasciare no retry?
    const getLastArticles = async (tags: Tag[]) => {
        const tempArticles = {} as LastArticles
        const promises = []
        for (const tag of tags) {
            promises.push(
                api
                    .getLastArticleByTag(tag.name, {
                        retryType: RetryType.NO_RETRY,
                    })
                    .then(article => {
                        tempArticles[tag.name] = article
                    })
                    .catch(err => {
                        console.log(err)
                    })
            )
        }
        await Promise.allSettled(promises)
        return tempArticles
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
        // const testTags = [
        //     { name: "TEST 1", image: "" },
        //     { name: "TEST 2", image: "" },
        //     { name: "TEST 3", image: "" },
        //     { name: "TEST 4", image: "" },
        //     { name: "TEST 5", image: "" },
        //     { name: "TEST 6", image: "" },
        //     { name: "TEST 7", image: "" },
        //     { name: "TEST 8", image: "" },
        //     { name: "TEST 9", image: "" },
        // ]
        const fetchData = async () => {
            const responseTags = await api.getTags()
            const responseArticles = await getLastArticles(responseTags)
            // setTags([...responseTags, ...testTags])
            setTags(responseTags)
            setLastArticles(responseArticles)
        }
        fetchData().catch(err => console.log(err))
    }, [])

    // Function that calculates heights and columns of tag cards using hardcoded patterns.
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
                })
                index++
                remaining--
            }
        }
        return tempTagsWithData
    }

    const getHighlightedArticle = () => {
        const favouriteTags = tags.filter(tag => favourites[tag.name] !== false)
        // If there are no favourite tags, choose the highlighted article from all the other tags
        const tagsToAnalyze = favouriteTags.length > 0 ? favouriteTags : tags
        let tempHighlighted: Article | undefined = undefined

        for (const tag of tagsToAnalyze) {
            if (!tempHighlighted) {
                tempHighlighted = lastArticles[tag.name]
            } else {
                const article = lastArticles[tag.name]
                const articleDate = new Date(article?.publish_time)
                const highlightedDate = new Date(tempHighlighted.publish_time)
                if (articleDate > highlightedDate) {
                    tempHighlighted = article
                }
            }
        }
        return tempHighlighted
    }

    return (
        <NewsBottomSheet
            favouriteTags={getTagsWithData(true)}
            otherTags={getTagsWithData(false)}
            highlightedArticle={getHighlightedArticle()}
            updateFavourites={(categoryName, favourite) => {
                const tempFavourites = { ...favourites }
                tempFavourites[categoryName] = favourite
                setFavourites(tempFavourites)
            }}
        />
    )
}
