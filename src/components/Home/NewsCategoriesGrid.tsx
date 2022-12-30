import React, { useState, useEffect } from "react"
import { View } from "react-native"

import { CardWithGradient } from "components/CardWithGradient"
import { poliNetworkApi, Tag } from "api"
import { useNavigation } from "navigation/NavigationTypes"
import { newsCategoryPatterns, CardsPattern } from "utils/cardsPatterns"

/** Tuple contianing the category object with the height of its card */
export type CategoryAndHeight = [Tag, number]

export interface CategoriesColumns {
    /** left column of news categories*/
    left: CategoryAndHeight[]
    /** right column of news categories*/
    right: CategoryAndHeight[]
}

/**
 * Component used to display the grid of news categories inside of
 * the news bottom sheet in the home page.
 */
export const NewsCategoriesGrid = () => {
    const navigation = useNavigation()

    // Store the list of news categories with their heights, divided into left and right columns
    const [categories, setCategories] = useState<CategoriesColumns>({
        left: [],
        right: [],
    })

    // Get the news categories from the backend and use hardcoded
    // patterns to get heights and positions (left / right) of the cards
    const updateNewsCategories = async () => {
        try {
            const response = await poliNetworkApi.getTags()
            const tempCategories: CategoriesColumns = { left: [], right: [] }

            // store the pattern data of the current batch of cards
            let pattern: CardsPattern
            // index of the current category
            let index = 0
            // number of categories remaining
            let remaining = response.length

            while (index < response.length) {
                // choose the dimension of the next batch of categories and get the corresponding pattern
                if (index === 0) {
                    // When first bacth
                    if (remaining <= 6) {
                        pattern = newsCategoryPatterns.first[remaining]
                    } else {
                        pattern = newsCategoryPatterns.first[4]
                    }
                } else {
                    // When other batches. Here it is never possible that remaining === 1 or remaining === 2
                    if (remaining % 5 === 1 || remaining % 5 === 3) {
                        pattern = newsCategoryPatterns.other[3]
                    } else if (remaining % 5 === 2 || remaining % 5 === 4) {
                        pattern = newsCategoryPatterns.other[4]
                    } else {
                        pattern = newsCategoryPatterns.other[5]
                    }
                }

                for (const [height, column] of pattern) {
                    tempCategories[column].push([response[index], height])
                    index++
                    remaining--
                }
            }
            setCategories(tempCategories)
        } catch (error) {
            console.log(error)
        }
    }

    // TODO: should add a way to refresh news categories ?
    useEffect(() => {
        void updateNewsCategories()
    }, [])

    // Function used when displaying the cards
    const getCategoriesCards = (list: CategoryAndHeight[]) => {
        return list.map(([category, height], index) => {
            return (
                <CardWithGradient
                    key={index}
                    title={category.name}
                    imageURL={category.image}
                    onClick={() =>
                        navigation.navigate("NewsList", {
                            categoryName: category.name,
                        })
                    }
                    closerToCorner={true}
                    style={{ height: height }}
                />
            )
        })
    }

    return (
        <View style={{ paddingBottom: 120 }}>
            <>
                <CardWithGradient
                    // the news highlight card
                    title={"In Evidenza"}
                    imageURL={undefined} // TODO: update with correct highlight image
                    onClick={() =>
                        navigation.navigate("NewsList", {
                            categoryName: "Evidenza",
                        })
                    }
                    style={{ height: 220 }}
                />

                {categories.left.length === 1 &&
                categories.right.length === 0 ? (
                    // if there is only 1 news category, display the card at full width
                    categories.left[0]
                ) : (
                    <View style={{ flexDirection: "row" }}>
                        <View
                            // left column of news category cards
                            style={{ flex: 17, marginRight: 17 }}
                        >
                            {getCategoriesCards(categories.left)}
                        </View>

                        <View
                            // right column of news category cards
                            style={{ flex: 14 }}
                        >
                            {getCategoriesCards(categories.right)}
                        </View>
                    </View>
                )}
            </>
        </View>
    )
}
