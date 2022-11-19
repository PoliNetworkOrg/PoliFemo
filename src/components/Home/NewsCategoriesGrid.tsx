import React, { useState, useEffect, ReactNode } from "react"
import { View } from "react-native"

import { useNavigation } from "navigation/NavigationTypes"
import { CardWithGradient } from "components/CardWithGradient"
import {
    allNewsCardsPatterns as allPatterns,
    NewsCardsPattern,
} from "utils/newsCardPatterns"

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

    const [newsCategoryCards, setNewsCategoryCards] =
        useState<NewsCategoryCards>()

    const testCategories = [
        "Segreteria",
        "Eventi",
        "Gaming",
        "Anime & Manga",
        "Mobilità Internazionale",
        "Polimi Sport",
        "Poli Jobs",
        "Poli Book",
        "Fotografia & Videomaking",
    ]

    useEffect(() => {
        // NON MI PIACE IL COMMENTO, SPIEGARE MEGLIO
        // TODO: usare operazione % e lasciare tutti i blocchi da 5 per gli ultimi batch
        // Build the list of news category cards divided into left and right column, using hardcoded
        // patterns when there is a low number of news categories, and a combination of patterns otherwise
        const categories = testCategories
        const tempCards: NewsCategoryCards = { left: [], right: [] }

        let remaining = categories.length
        let index = 0
        let pattern: NewsCardsPattern

        while (index < categories.length) {
            if (index === 0) {
                // choose a pattern for the first batch of news category cards
                if (remaining <= 4 || remaining === 5 || remaining === 6) {
                    pattern = allPatterns.start[remaining]
                } else {
                    pattern = allPatterns.start[4]
                }
            } else {
                // choose a pattern for an other batch of news category cards
                if (remaining === 6) {
                    pattern = allPatterns.other[3]
                } else if (remaining === 7) {
                    pattern = allPatterns.other[4]
                } else if (remaining >= 5) {
                    pattern = allPatterns.other[5]
                } else {
                    pattern = allPatterns.other[remaining]
                }
            }
            // create all the cards using the data in the pattern and append them to the correct column
            for (const [height, column] of pattern) {
                tempCards[column].push(
                    <CardWithGradient
                        key={index}
                        title={categories[index]}
                        onClick={() => console.log(categories[index])}
                        style={{ height: height }}
                    />
                )
                index++
                remaining--
            }
        }
        setNewsCategoryCards(tempCards)
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

            {newsCategoryCards?.left.length === 1 &&
            newsCategoryCards?.right.length === 0 ? (
                // if there is only 1 news category card, display it at full width
                newsCategoryCards.left[0]
            ) : (
                <View style={{ flexDirection: "row" }}>
                    <View
                        // left column of news category cards
                        style={{ flex: 17, marginRight: 17 }}
                    >
                        {newsCategoryCards?.left}
                    </View>
                    <View
                        // right column of news category cards
                        style={{ flex: 14 }}
                    >
                        {newsCategoryCards?.right}
                    </View>
                </View>
            )}
        </View>
    )
}
