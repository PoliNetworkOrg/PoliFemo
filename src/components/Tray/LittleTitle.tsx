import React, { FC } from "react"
import { LinearGradient } from "expo-linear-gradient"
import MaskedView from "@react-native-masked-view/masked-view"

import { Text } from "components/Text"

export const LittleTitle: FC = () => {
  return (
    <MaskedView
      nativeID="little-title"
      style={{ flex: 1, marginLeft: 28 }}
      maskElement={
        <Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              color: "black",
            }}
          >
            POLI
          </Text>
          <Text
            style={{
              fontWeight: "300",
              fontSize: 20,
              color: "black",
            }}
          >
            FEMO
          </Text>
        </Text>
      }
    >
      <LinearGradient
        colors={[
          "rgba(135, 145, 189, 1)",
          "rgba(135, 145, 189, 1)",
          "rgba(135, 145, 189, 0.43)",
          "rgba(255, 255, 255, 0)",
          "rgba(255, 255, 255, 0.09)",
          "rgba(255, 255, 255, 0.0)",
        ]}
        locations={[0, 0.3833, 0.6229, 0.9998, 0.9999, 1]}
        style={{ flex: 1 }}
      />
    </MaskedView>
  )
}
