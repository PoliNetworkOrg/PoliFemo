import React, { FC } from "react"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { View } from "react-native"

export const CrowdSliderLabels: FC = () => {
  const { isLight } = usePalette()

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <BodyText
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: isLight ? "#414867" : "#fff",
          alignSelf: "flex-start",
        }}
      >
        Basso
      </BodyText>
      <BodyText
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: isLight ? "#414867" : "#fff",
          position: "absolute",
          alignSelf: "center",
        }}
      >
        Medio
      </BodyText>
      <BodyText
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: isLight ? "#414867" : "#fff",
          position: "absolute",
          alignSelf: "flex-end",
        }}
      >
        Alto
      </BodyText>
    </View>
  )
}
