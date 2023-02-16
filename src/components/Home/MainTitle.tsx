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
        colors={[
          "rgba(255, 181, 68, 1)",
          "rgba(255, 181, 68, 1)",
          "rgba(255, 181, 68, 1)",
          "rgba(255, 181, 68, 0.43)",
          "rgba(255, 255, 255, 0)",
          "rgba(255, 255, 255, 0.09)",
          "rgba(27, 33, 50, 1)",
        ]}
        locations={[0.0811, 0.0812, 0.305, 0.659, 0.9998, 0.9999, 1]}
        style={{ flex: 1 }}
      />
    </MaskedView>
  )
}
