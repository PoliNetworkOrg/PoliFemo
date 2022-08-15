import React, { FC } from "react"
import { LinearGradient } from "expo-linear-gradient"
import MaskedView from "@react-native-masked-view/masked-view"

import { Text } from "components/Text"

export const MainTitle: FC = () => {
    return (
        <MaskedView
            style={{ height: 75 }}
            maskElement={
                <Text style={{ textAlign: "center" }}>
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 64,
                            color: "black",
                        }}
                    >
                        POLI
                    </Text>
                    <Text
                        style={{
                            fontWeight: "300",
                            fontSize: 64,
                            color: "black",
                        }}
                    >
                        FEMO
                    </Text>
                </Text>
            }
        >
            <LinearGradient
                colors={["#FFB544", "#424967"]}
                style={{ flex: 1 }}
            />
        </MaskedView>
    )
}
