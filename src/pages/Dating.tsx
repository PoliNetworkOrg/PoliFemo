import React, { FC } from "react"
import { Text, View } from "react-native"

export const Dating: FC = () => {
    return (
        <View
            style={{
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    fontWeight: "bold",
                    fontSize: 24,
                }}
            >
                [Dating: Feature non approvata]
            </Text>
        </View>
    )
}
