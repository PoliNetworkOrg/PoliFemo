import React, { FC } from "react"
import { Text, View, Image, StyleSheet, Pressable } from "react-native"

// I componenti sono delle funzioni, a cui viene passato come argomento un oggetto props
// https://it.reactjs.org/docs/components-and-props.html
// possono essere riutilizzati (tipo bottoni stilizzati) o possono rappresentare intere pagine
export const Card: FC<{
    titolo?: string
    sottotitolo?: string
    imageURL?: string
    onClick?: any
}> = props => {
    // all'interno dei tag Text può essere passato del testo interpolato con delle espressioni
    // avvolte da delle parentesi graffe (in questo caso, l'espressione è il ternary operator che
    // restituisce una stringa eventualmente concatenata al nome)

    const image =
        props.imageURL == null ? (
            <Text></Text>
        ) : (
            // eslint-disable-next-line no-extra-parens
            <Image
                style={styles.tinyLogo}
                source={{
                    uri: props.imageURL,
                }}
            />
        )

    return (
        <Pressable
            style={{
                borderRadius: 8,
                borderWidth: 2,
                padding: 15,
                flex: 1,
                margin: 4,
                flexDirection: "row",
            }}
            onPress={props.onClick ?? null}
        >
            {image}
            <View>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {props.titolo}
                </Text>
                <Text>{props.sottotitolo}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    tinyLogo: {
        width: 50,
        height: 50,
        flex: 1,
        minWidth: 50,
        maxWidth: 70,
        minHeight: 50,
        maxHeight: 50,
        resizeMode: "contain",
    },
})
