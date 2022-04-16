import React, { FC } from "react"
import { Text, View } from "react-native"
import { Card, CardProps } from "./Card"
import { Grid } from "./Grid"

// I componenti sono delle funzioni, a cui viene passato come argomento un oggetto props
// https://it.reactjs.org/docs/components-and-props.html
// possono essere riutilizzati (tipo bottoni stilizzati) o possono rappresentare intere pagine
export const CardSection: FC<{
    title?: string
    cards: CardProps[]
    numColumns?: number
    renderItem?: (value: { item: CardProps; index: number }) => JSX.Element
}> = props => {
    // all'interno dei tag Text può essere passato del testo interpolato con delle espressioni
    // avvolte da delle parentesi graffe (in questo caso, l'espressione è il ternary operator che
    // restituisce una stringa eventualmente concatenata al nome)
    return (
        <View>
            <Text
                style={{
                    fontSize: 48,
                    fontWeight: "bold",
                }}
            >
                {props.title}
            </Text>

            <Grid
                data={props.cards}
                numColumns={props.numColumns}
                renderItem={
                    props.renderItem ??
                    (({ item, index }) => (
                        <Card {...item} key={props.title + "card" + index} />
                    ))
                }
            />
        </View>
    )
}
