import React, { useState, useEffect, ReactNode } from "react"
import { View } from "react-native"

import { useNavigation } from "navigation/NavigationTypes"
import { CardWithGradient } from "components/CardWithGradient"
import {
    allNewsCardsPatterns as allPatterns,
    NewsCardsPattern,
} from "utils/newsCardsPatterns"
import { api } from "api"

export interface NewsCategoryCards {
    /** left column of news category cards*/
    left: ReactNode[]
    /** right column of news category cards*/
    right: ReactNode[]
}

/**
 * Component used to display a grid of news categories inside of
 * the news bottom sheet in the home page.
 */
export const NewsCategoriesGrid = () => {
    const navigation = useNavigation()

    // Store the list of news category cards divided into left and right columns
    const [cards, setCards] = useState<NewsCategoryCards>({
        left: [],
        right: [],
    })

    const capitalize = (string: string) => {
        const arr = string.split(" ")
        for (let i = 0; i < arr.length; i++) {
            arr[i] =
                arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase()
        }
        return arr.join(" ")
    }

    useEffect(() => {
        // Build the list of news category cards divided into left and right columns,
        // using hardcoded patterns to get the heights and positions (left or right) of the cards
        api.getTags()
            .then(categories => {
                const tempCards: NewsCategoryCards = { left: [], right: [] }
                let pattern: NewsCardsPattern
                let index = 0
                let remaining = categories.length

                while (index < categories.length) {
                    if (index === 0) {
                        // choose a pattern for the first batch of news category cards
                        if (remaining <= 6) {
                            pattern = allPatterns.start[remaining]
                        } else {
                            pattern = allPatterns.start[4]
                        }
                    } else {
                        // choose a pattern for an other batch of news category cards
                        // here it is never possible that remaining === 1 or remaining === 2
                        if (remaining % 5 === 1 || remaining % 5 === 3) {
                            pattern = allPatterns.other[3]
                        } else if (remaining % 5 === 2 || remaining % 5 === 4) {
                            pattern = allPatterns.other[4]
                        } else {
                            pattern = allPatterns.other[5]
                        }
                    }
                    // create all the cards using the data in the pattern and append them to the correct column
                    for (const [height, column] of pattern) {
                        tempCards[column].push(
                            <CardWithGradient
                                key={index}
                                title={capitalize(categories[index].name)}
                                imageURL={categories[index].image}
                                onClick={() =>
                                    console.log(categories[index].name)
                                }
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
        <View style={{ paddingBottom: 110 }}>
            <CardWithGradient
                // the news highlight card
                title={"In Evidenza"}
                closerToCorner={false}
                onClick={() => navigation.navigate("NewsHighlights")}
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
