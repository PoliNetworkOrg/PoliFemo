import React, { useState, useEffect, useRef } from "react"
import { View } from "react-native"

import { api, Article, RetryType } from "api"
import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import { ScrollPageInfinite } from "components/ScrollPageInfinite"
import { CardWithGradient } from "components/CardWithGradient"

/**
 * News page containing the articles of a specific category.
 */
export const NewsList: RootStackScreen<"NewsList"> = props => {
    const navigation = useNavigation()

    // Name of the news category, which is the title of the page
    const { categoryName } = props.route.params

    // State of the toggle switch in the header (on / off)
    const [toggled, setToggled] = useState<boolean>(false)

    const [articles, setArticles] = useState<Article[]>([])

    const [manualRefreshing, setManualRefreshing] = useState<boolean>(false)
    const [automaticDownload, setAutomaticDownload] = useState<boolean>(false)

    const lastDate = useRef<Date>(new Date())

    // TODO: get only the articles of the given category
    const updateArticles = async (retryType: RetryType, keep = true) => {
        try {
            const response = await api.getArticlesFromDaysAgoTillDateByTag(
                7,
                new Date().toISOString(),
                categoryName,
                { retryType: retryType, maxRetries: 2, waitingTime: 2 }
            )

            if (keep) {
                setArticles([...articles, ...response.reverse()])
            } else {
                setArticles(response.reverse())
            }
        } catch (error) {
            console.log(error)
        }
        setManualRefreshing(false)
    }

    useEffect(() => {
        void updateArticles(RetryType.RETRY_N_TIMES)
    }, [])

    return (
        <ScrollPageInfinite
            title={categoryName}
            data={articles}
            render={article => {
                return (
                    <View style={{ paddingHorizontal: 28 }}>
                        <CardWithGradient
                            key={article.id} // TODO: update with article id
                            title={article.title}
                            imageURL={article.image} // TODO: update with correct article image
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
                void updateArticles(RetryType.NO_RETRY, false)
            }}
            refreshControl={{
                refreshing: manualRefreshing,
                onRefresh: () => {
                    setManualRefreshing(true)
                    void updateArticles(RetryType.NO_RETRY, false)
                },
            }}
            showSwitch={true}
            switchValue={toggled}
            onSwitchToggle={value => setToggled(value)}
        />
        // {/* <View style={{ flex: 1, paddingTop: 16 }}> ////////
        //     {articles.map((article, index) => {
        //         return (
        //             <CardWithGradient
        //                 key={index} // TODO: update with article id
        //                 title={article.title}
        //                 imageURL={article.image} // TODO: update with correct article image
        //                 onClick={() =>
        //                     navigation.navigate("Article", {
        //                         article: article,
        //                     })
        //                 }
        //                 style={{ height: 220, marginBottom: 13 }}
        //             />
        //         )
        //     })}
        // </View> */}
    )
}
