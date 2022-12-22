import React, { useState, useEffect, useRef } from "react"
import { View } from "react-native"
import { AxiosError } from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { api, Article, RetryType } from "api"
import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import { ScrollPageInfinite } from "components/ScrollPageInfinite"
import { CardWithGradient } from "components/CardWithGradient"
import { getDateFromDaysBefore } from "utils/dates"

/**
 * News page containing the articles of a specific tag.
 */
export const ArticlesList: RootStackScreen<"ArticlesList"> = props => {
    const navigation = useNavigation()

    // Name of the news tag, which is the title of the page
    //
    const { tagName, isFavourite, onFavouriteChange } = props.route.params

    const [articles, setArticles] = useState<Article[]>([])

    const [toggled, setToggled] = useState<boolean>(isFavourite)

    const [manualRefreshing, setManualRefreshing] = useState<boolean>(false)
    const [automaticDownload, setAutomaticDownload] = useState<boolean>(false)

    const initialDateRange = 7
    const maxDateRange = 30
    const dateRangeMultiplier = 2

    const dateRange = useRef<number>(initialDateRange)
    const endDate = useRef<Date>(new Date())
    const startDate = useRef<Date>(
        getDateFromDaysBefore(endDate.current, dateRange.current)
    )

    //TODO: MainApi fa retry se error 500, mentre se error 404 non fa retry
    //TODO: aggiornare codice se e quando backend farà quella roba

    const slideDateRange = () => {
        // console.log(startDate.current)
        // console.log(endDate.current)
        endDate.current = startDate.current
        startDate.current = getDateFromDaysBefore(
            endDate.current,
            dateRange.current
        )
    }

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

    const updateArticles = async (retryType: RetryType, keep: boolean) => {
        try {
            const response = await api.getArticlesFromDateTillDateByTag(
                startDate.current.toISOString(),
                endDate.current.toISOString(),
                tagName,
                { retryType: RetryType.NO_RETRY }
                // {
                //     retryType: RetryType.RETRY_N_TIMES,
                //     maxRetries: 2,
                //     waitingTime: 2,
                // }
            )

            dateRange.current = initialDateRange
            slideDateRange()

            if (keep) {
                setArticles([...articles, ...response])
            } else {
                setArticles(response.reverse())
            }
        } catch (error) {
            console.log(error)

            if (
                error instanceof AxiosError &&
                error.response?.status === 404 &&
                dateRange.current <= maxDateRange
            ) {
                // successfull request but no articles found
                dateRange.current *= dateRangeMultiplier
                slideDateRange()
                void updateArticles(RetryType.NO_RETRY, keep)
            }
        }
        setManualRefreshing(false)
        setAutomaticDownload(false)
    }

    useEffect(() => {
        void updateArticles(RetryType.RETRY_N_TIMES, true)
    }, [])

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
                setAutomaticDownload(true)
                if (dateRange.current <= maxDateRange)
                    void updateArticles(RetryType.NO_RETRY, true)
            }}
            refreshControl={{
                refreshing: manualRefreshing,
                onRefresh: () => {
                    setManualRefreshing(true)
                    dateRange.current = initialDateRange
                    endDate.current = new Date()
                    startDate.current = getDateFromDaysBefore(
                        endDate.current,
                        dateRange.current
                    )
                    void updateArticles(RetryType.NO_RETRY, false)
                },
            }}
            showSwitch={true}
            switchValue={toggled}
            onSwitchToggle={value => {
                setToggled(value)
                onFavouriteChange(value)
            }}
        />
    )
}
