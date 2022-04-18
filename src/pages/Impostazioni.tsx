import React, { FC } from "react"
import { Text, View } from "react-native"
import { ImageChange } from "../components/ImageChange"

export const Impostazioni: FC = () => {
    return (
        <View
            style={{
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ImageChange
                imageURLs={[
                    "https://icon-library.com/images/icon-for-settings/icon-for-settings-1.jpg",
                ]}
            />
            <Text
                style={{
                    fontWeight: "bold",
                    fontSize: 24,
                }}
            >
                Impostazioni
            </Text>
        </View>
    )
}
