import React, { useState, useEffect, ReactNode } from "react"
import { View } from "react-native"

import { api, RetryType } from "api"
import { RootStackScreen } from "navigation/NavigationTypes"
import { Page } from "components/Page"
import { CardWithGradient } from "components/CardWithGradient"

/**
 * News page containing the articles of a specific category.
 */
export const NewsList: RootStackScreen<"NewsList"> = props => {
    const { categoryName } = props.route.params

    const [articlesCards, setArticlesCards] = useState<ReactNode[]>([])

    const [refreshing, setRefreshing] = useState<boolean>(false)

    const updateArticles = (retryType: RetryType) => {
        api.getArticles(retryType)
            .then(articles => {
                const tempArticlesCards: ReactNode[] = []
                let index = 0
                for (const article of articles) {
                    tempArticlesCards.push(
                        <CardWithGradient
                            key={index} // TODO: update with article id
                            title={article.title.it}
                            imageURL={undefined} // TODO: update with correct article image
                            onClick={() => {
                                // TODO: here navigate to the article page
                                console.log(article.title.it)
                            }}
                            style={{ height: 220, marginBottom: 13 }}
                        />
                    )
                    index++
                }
                setArticlesCards(tempArticlesCards)
            })
            .catch(error => console.log(error))
            .finally(() => {
                setRefreshing(false)
            })
    }

    // TODO: get only the articles of the given category
    useEffect(() => {
        updateArticles(RetryType.RETRY_INDEFINETELY)
    }, [])

    return (
        <Page
            title={categoryName}
            refreshControl={{
                refreshing,
                onRefresh: () => {
                    setRefreshing(true)
                    updateArticles(RetryType.NO_RETRY)
                },
            }}
        >
            <View style={{ flex: 1, paddingTop: 16 }}>{articlesCards}</View>
        </Page>
    )
}
