import React, { FC } from "react"
import { StyleSheet, Text, View } from "react-native"
import { ImageChange } from "../components/ImageChange"

export const Article: FC<{
    titolo?: string
    corpo?: string
    imageURL?: string[]
}> = props => {
    return (
        <View style={styles.screen}>
            <Text>{props.titolo}</Text>
            <Text>
                <ImageChange imageURL={props.imageURL} />
            </Text>
            <Text>{props.corpo}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
})
