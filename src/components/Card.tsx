import React, { FC } from "react"
import { Text, View } from "react-native"

// I componenti sono delle funzioni, a cui viene passato come argomento un oggetto props
// https://it.reactjs.org/docs/components-and-props.html
// possono essere riutilizzati (tipo bottoni stilizzati) o possono rappresentare intere pagine
export const Card: FC<{ titolo?: string; sottotitolo?: string }> = props => {
    // all'interno dei tag Text può essere passato del testo interpolato con delle espressioni
    // avvolte da delle parentesi graffe (in questo caso, l'espressione è il ternary operator che
    // restituisce una stringa eventualmente concatenata al nome)
    return (
        <View style={{ borderRadius: 15, borderWidth: 2, padding: 8 }}>
            <Text style={{ fontSize: 24 }}>{props.titolo}</Text>
            <Text>{props.sottotitolo}</Text>
        </View>
    )
}
