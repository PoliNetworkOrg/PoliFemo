import React, { useEffect, useState } from "react"
import { DeviceEventEmitter } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { api, RetryType, Tag, Article } from "api"
import {
    TagWithData,
    Preference,
    Preferences,
    LastArticles,
    UpdatePreferenceEventArgs,
    UPDATE_PREFERENCE_EVENT_NAME,
} from "./newsTypes"
import { NewsBottomSheet } from "./NewsBottomSheet"
import { newsTagsPatterns, CardsPattern } from "utils/cardsPatterns"

/**
 * Bottom sheet in the home page to access the news.
 *
 * This is the component that retrieves and precesses the news content.
 * Afterwards, it passes the data to the NewsBottomSheet.
 */
export const NewsManager = () => {
    const [tags, setTags] = useState<Tag[]>([])

    // Object to store the preference of each tag
    const [preferences, setPreferences] = useState<Preferences>({})
    // Object to store the last article of each tag
    const [lastArticles, setLastArticles] = useState<LastArticles>(
        {} as LastArticles
    )

    useEffect(() => {
        console.log("Loading tags preferences from storage")
        AsyncStorage.getItem("newstags:preferences")
            .then(preferencesJSON => {
                if (preferencesJSON) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const data: Preferences = JSON.parse(preferencesJSON)
                    setPreferences(data)
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        console.log("Saving tags preferences to storage")
        AsyncStorage.setItem(
            "newstags:preferences",
            JSON.stringify(preferences)
        ).catch(err => console.log(err))
    }, [preferences])

    // TODO: sicuro di lasciare no retry?
    // Download the last published article of each tag (news category) in parallel
    // and wait until each one has finished
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
        // Load tags (news categories) and their last article (one for each tag)
        const fetchData = async () => {
            const responseTags = await api.getTags()
            const responseArticles = await getLastArticles(responseTags)
            setTags(responseTags)
            setLastArticles(responseArticles)
        }
        fetchData().catch(err => console.log(err))
    }, [])

    useEffect(() => {
        // Set up the event listener to update the preference of a tag in the state of this component
        // when the corresponding event is emitted in ArticlesList
        DeviceEventEmitter.addListener(
            UPDATE_PREFERENCE_EVENT_NAME,
            (arg: UpdatePreferenceEventArgs) => {
                setPreferences({
                    ...preferences,
                    [arg.tagName]: arg.preference,
                })
            }
        )
        return () => {
            DeviceEventEmitter.removeAllListeners(UPDATE_PREFERENCE_EVENT_NAME)
        }
    }, [preferences])

    const filterTags = (tags: Tag[], preference: Preference) => {
        return tags.filter(tag => {
            if (preference === Preference.OTHER) {
                return preferences[tag.name] === Preference.OTHER
            } else {
                // If undefined, the tag is marked as favourite by default
                return preferences[tag.name] !== Preference.OTHER
            }
        })
    }

    // Function that calculates heights and columns of tag cards using hardcoded patterns.
    // Then it returns a new list of tags with that and other usefull data.
    const getTagsWithData = (preference: Preference) => {
        const tempTagsWithData: TagWithData[] = []
        const tagsToShow = filterTags(tags, preference)

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
                    preference: preference,
                })
                index++
                remaining--
            }
        }
        return tempTagsWithData
    }

    const getHighlightedArticle = () => {
        const favouriteTags = filterTags(tags, Preference.FAVOURITE)
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
            favouriteTags={getTagsWithData(Preference.FAVOURITE)}
            otherTags={getTagsWithData(Preference.OTHER)}
            highlightedArticle={getHighlightedArticle()}
        />
    )
}
