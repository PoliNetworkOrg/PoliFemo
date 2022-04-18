import React, { FC } from "react"
import { Text, View } from "react-native"

export const AuleLibere: FC = () => {
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
                Aule libere
            </Text>
        </View>
    )
}
