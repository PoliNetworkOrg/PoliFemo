import React, { useState, useEffect, ReactNode } from "react"
import { View } from "react-native"

import { CardWithGradient } from "components/CardWithGradient"
import { api } from "api"
import { useNavigation } from "navigation/NavigationTypes"
import { newsCategoryPatterns, CardsPattern } from "utils/cardsPatterns"

export interface NewsCategoryCards {
    /** left column of news category cards*/
    left: ReactNode[]
    /** right column of news category cards*/
    right: ReactNode[]
}

/**
 * Component used to display the grid of news categories inside of
 * the news bottom sheet in the home page.
 */
export const NewsCategoriesGrid = () => {
    const navigation = useNavigation()

    // Store the list of news category cards divided into left and right columns
    const [cards, setCards] = useState<NewsCategoryCards>({
        left: [],
        right: [],
    })

    // TODO: should add a way to refresh news categories ?
    useEffect(() => {
        // Get the news categories from the backend and build the list of cards
        // using hardcoded patterns to get heights and positions (left / right) of the cards
        api.getTags()
            .then(categories => {
                const tempCards: NewsCategoryCards = { left: [], right: [] }

                // store the pattern data of the current batch of cards
                let pattern: CardsPattern
                // index of the current category
                let index = 0
                // number of categories remaining
                let remaining = categories.length

                while (index < categories.length) {
                    // choose the dimension of the next batch of cards and get the corresponding pattern
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
                    // create all the cards using the data in the pattern and append them to the correct column
                    for (const [height, column] of pattern) {
                        const title = categories[index].name
                        tempCards[column].push(
                            <CardWithGradient
                                key={index}
                                title={title}
                                imageURL={categories[index].image}
                                onClick={() =>
                                    navigation.navigate("NewsList", {
                                        categoryName: title,
                                    })
                                }
                                closerToCorner={true}
                                style={{ height: height }}
                            />
                        )
                        index++
                        remaining--
                    }
                }
                setCards(tempCards)
            })
            .catch(error => console.log(error))
    }, [])

    return (
        <View style={{ paddingBottom: 120 }}>
            <CardWithGradient
                // the news highlight card
                title={"In Evidenza"}
                imageURL={undefined} // TODO: update with correct highlight image
                onClick={() =>
                    navigation.navigate("NewsList", {
                        categoryName: "In Evidenza",
                    })
                }
                style={{ height: 220 }}
            />

            {cards.left.length === 1 && cards.right.length === 0 ? (
                // if there is only 1 news category card, display it at full width
                cards.left[0]
            ) : (
                <View style={{ flexDirection: "row" }}>
                    <View
                        // left column of news category cards
                        style={{ flex: 17, marginRight: 17 }}
                    >
                        {cards.left}
                    </View>
                    <View
                        // right column of news category cards
                        style={{ flex: 14 }}
                    >
                        {cards.right}
                    </View>
                </View>
            )}
        </View>
    )
}
