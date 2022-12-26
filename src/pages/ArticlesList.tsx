import React, { useState, useEffect, useRef } from "react"
import { View, DeviceEventEmitter } from "react-native"

import { api, Article, RetryType } from "api"
import { Preference, UPDATE_PREFERENCE_EVENT_NAME } from "components/Home/News"
import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import { ScrollPageInfinite } from "components/ScrollPageInfinite"
import { CardWithGradient } from "components/CardWithGradient"
import { capitalize } from "utils/strings"

const MAX_ARTICLES_PER_REQUEST = 8

/**
 * News page containing the articles of a specific tag.
 */
export const ArticlesList: RootStackScreen<"ArticlesList"> = props => {
    const navigation = useNavigation()
    const { tagName, tagPreference } = props.route.params

    const [articles, setArticles] = useState<Article[]>([])
    const [toggled, setToggled] = useState<boolean>(
        tagPreference === Preference.FAVOURITE
    )

    const [refresh, setRefresh] = useState<boolean>(false)
    const [isFetching, setIsFetching] = useState<boolean>(true)

    const offset = useRef<number>(0)

    // TODO: forse mettere un po' di retry indefinetely, ma modificando mainApi
    // per fare in modo che dopo errore 404 non tenta di scaricare di nuovo
    const fetchArticles = async (
        retryType: RetryType,
        keepArticles: boolean
    ) => {
        try {
            const response = await api.getArticlesFromOffsetByTag(
                tagName,
                MAX_ARTICLES_PER_REQUEST,
                offset.current,
                { retryType: retryType, maxRetries: 2, waitingTime: 2 }
            )
            if (keepArticles) {
                // Keep previously downloaded articles
                setArticles([...articles, ...response])
            } else {
                // Overwrite previously downloaded articles
                setArticles(response)
            }
            // Increase the offset so that at the following fetch you get the next articles
            offset.current += 1
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchArticles(RetryType.NO_RETRY, false).finally(() =>
            setIsFetching(false)
        )
    }, [])

    return (
        <ScrollPageInfinite
            title={capitalize(tagName, 3)}
            data={articles}
            render={article => {
                return (
                    <View style={{ paddingHorizontal: 28 }}>
                        <CardWithGradient
                            key={article.id}
                            title={article.title}
                            imageURL={article.image}
                            onClick={() =>
                                navigation.navigate("Article", {
                                    article: article,
                                })
                            }
                            style={{ height: 220, marginBottom: 13 }}
                        />
                    </View>
                )
            }}
            fetchControl={{
                fetching: isFetching,
                onFetch: () => {
                    if (!refresh && !isFetching) {
                        setIsFetching(true)
                        fetchArticles(RetryType.NO_RETRY, true).finally(() => {
                            setIsFetching(false)
                        })
                    }
                },
            }}
            refreshControl={{
                refreshing: refresh,
                onRefresh: () => {
                    if (!refresh && !isFetching) {
                        setRefresh(true)
                        offset.current = 0
                        fetchArticles(RetryType.NO_RETRY, false).finally(() => {
                            setRefresh(false)
                        })
                    }
                },
            }}
            showSwitch={true}
            switchControl={{
                toggled: toggled,
                onToggle: value => {
                    setToggled(value)
                    DeviceEventEmitter.emit(UPDATE_PREFERENCE_EVENT_NAME, {
                        tagName: tagName,
                        preference: value
                            ? Preference.FAVOURITE
                            : Preference.OTHER,
                    })
                },
            }}
        />
    )
}
