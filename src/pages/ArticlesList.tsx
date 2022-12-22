import React, { useState, useEffect, useRef } from "react"
import { View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { api, Article, RetryType } from "api"
import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import { ScrollPageInfinite } from "components/ScrollPageInfinite"
import { CardWithGradient } from "components/CardWithGradient"

/**
 * News page containing the articles of a specific tag.
 */
export const ArticlesList: RootStackScreen<"ArticlesList"> = props => {
    const navigation = useNavigation()
    const { tagName, isFavourite, onFavouriteChange } = props.route.params

    const [articles, setArticles] = useState<Article[]>([])
    const [toggled, setToggled] = useState<boolean>(isFavourite)

    const [refresh, setRefresh] = useState<boolean>(false)
    const isFetching = useRef<boolean>(false)

    const MAX_ARTICLES_PER_REQUEST = 8
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
        void fetchArticles(RetryType.NO_RETRY, false)
    }, [])

    useEffect(() => {
        AsyncStorage.getItem("newstags:favourite")
            .then(iconJSON => {
                console.log("Saving tag as favourite to storage")
                let data: { [key: string]: boolean } = {}
                if (iconJSON) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    data = JSON.parse(iconJSON)
                }
                AsyncStorage.setItem(
                    "newstags:favourite",
                    JSON.stringify({ ...data, [tagName]: toggled })
                ).catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }, [toggled])

    return (
        <ScrollPageInfinite
            title={tagName}
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
            fetchData={() => {
                if (!refresh && !isFetching.current) {
                    isFetching.current = true
                    fetchArticles(RetryType.NO_RETRY, true).finally(() => {
                        isFetching.current = false
                    })
                }
            }}
            refreshControl={{
                refreshing: refresh,
                onRefresh: () => {
                    if (!refresh && !isFetching.current) {
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
                    onFavouriteChange(value)
                },
            }}
        />
    )
}
