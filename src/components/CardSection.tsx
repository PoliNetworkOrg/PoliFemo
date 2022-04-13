import React, { FC, ComponentProps } from "react"
import { Text, View } from "react-native"
import { Card } from "./Card"

// I componenti sono delle funzioni, a cui viene passato come argomento un oggetto props
// https://it.reactjs.org/docs/components-and-props.html
// possono essere riutilizzati (tipo bottoni stilizzati) o possono rappresentare intere pagine
export const CardSection: FC<{
    titolo?: string
    cards: ComponentProps<typeof Card>[]
}> = props => {
    // all'interno dei tag Text può essere passato del testo interpolato con delle espressioni
    // avvolte da delle parentesi graffe (in questo caso, l'espressione è il ternary operator che
    // restituisce una stringa eventualmente concatenata al nome)
    return (
        <View style={{}}>
            <Text>{props.titolo}</Text>
            FlatGrid
        </View>
    )
}
