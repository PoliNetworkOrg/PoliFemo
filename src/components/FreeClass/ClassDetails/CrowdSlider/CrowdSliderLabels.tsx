import { FC } from "react"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { View } from "react-native"

export const CrowdSliderLabels: FC = () => {
  const { labelsHighContrast } = usePalette()

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
          color: labelsHighContrast,
          alignSelf: "flex-start",
        }}
      >
        Basso
      </BodyText>
      <BodyText
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: labelsHighContrast,
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
          color: labelsHighContrast,
          position: "absolute",
          alignSelf: "flex-end",
        }}
      >
        Alto
      </BodyText>
    </View>
  )
}
