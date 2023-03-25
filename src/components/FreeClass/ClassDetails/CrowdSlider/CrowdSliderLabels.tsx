import { FC } from "react"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { View } from "react-native"
import { useTranslation } from "react-i18next"

export const CrowdSliderLabels: FC = () => {
  const { labelsHighContrast } = usePalette()

  const { t } = useTranslation()

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
        {t("freeClass_low", { ns: "freeClass" })}
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
        {t("freeClass_med", { ns: "freeClass" })}
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
        {t("freeClass_high", { ns: "freeClass" })}
      </BodyText>
    </View>
  )
}
