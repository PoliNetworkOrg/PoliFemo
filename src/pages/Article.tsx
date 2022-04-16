import React, { FC } from "react"
import { StyleSheet, Text, View } from "react-native"
import { ImageChange } from "../components/ImageChange"

export const Article: FC<{
    title?: string
    body?: string
    imageURLs: string[]
}> = props => {
    return (
        <View style={styles.screen}>
            <Text>{props.title}</Text>
            <Text>
                <ImageChange imageURLs={props.imageURLs} />
            </Text>
            <Text>{props.body}</Text>
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
