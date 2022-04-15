import React, { FC } from "react"
import { View } from "react-native"
import { CardSection } from "../components/CardSection"

const cards: { titolo: string; sottotitolo: string }[] = []
for (let i = 0; i < 20; i++) {
    cards.push({
        titolo: `Funzionalità ${i}`,
        sottotitolo: `Descrizione ${i}`,
    })
}

export const Menu: FC = () => {
    return (
        <View>
            <CardSection
                titolo="Menu"
                cards={cards}
                numColumns={2}
            ></CardSection>
        </View>
    )
}
