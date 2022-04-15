import React, { FC } from "react"
import { StyleSheet, Text, View } from "react-native"

export const DemoScreen: FC<{ name?: string }> = props => {
    return (
        <View style={styles.screen}>
            <Text>{props.name}</Text>
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
