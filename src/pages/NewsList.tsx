import React, { useState, useEffect } from "react"
import { View } from "react-native"
import { api, RetryType } from "api"
import { MainStackScreen } from "navigation/NavigationTypes"
import { Page } from "components/Page"
import { CardWithGradient } from "components/CardWithGradient"
import { Article } from "api/articles"

/**
 * News page containing the articles of a specific category.
 */
export const NewsList: MainStackScreen<"NewsList"> = props => {
    // Name of the news category, which is the title of the page
    const { categoryName } = props.route.params

    // State of the toggle switch in the header (on / off)
    const [toggled, setToggled] = useState<boolean>(false)

    const [articles, setArticles] = useState<Article[]>([])

    const [refreshing, setRefreshing] = useState<boolean>(false)

    // TODO: get only the articles of the given category
    const updateArticles = async (retryType: RetryType) => {
        try {
            const response = await api.articles.getFromDaysAgoTillDate(
                3,
                new Date().toISOString(),
                { retryType: retryType }
            )
            setArticles(response)
        } catch (error) {
            console.log(error)
        }
        setRefreshing(false)
    }

    useEffect(() => {
        void updateArticles(RetryType.RETRY_INDEFINETELY)
    }, [])

    return (
        <Page
            title={categoryName}
            refreshControl={{
                refreshing,
                onRefresh: () => {
                    setRefreshing(true)
                    void updateArticles(RetryType.NO_RETRY)
                },
            }}
            showSwitch={true}
            switchValue={toggled}
            onSwitchToggle={value => setToggled(value)}
        >
            <View style={{ flex: 1, paddingTop: 16 }}>
                {articles.map((article, index) => {
                    return (
                        <CardWithGradient
                            key={index} // TODO: update with article id
                            title={article.title}
                            imageURL={undefined} // TODO: update with correct article image
                            onClick={() => {
                                // TODO: here navigate to the article page
                                console.log(article.title)
                            }}
                            style={{ height: 220, marginBottom: 13 }}
                        />
                    )
                })}
            </View>
        </Page>
    )
}
