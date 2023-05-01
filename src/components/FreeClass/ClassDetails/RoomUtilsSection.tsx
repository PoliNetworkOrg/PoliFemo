import { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { RoomUtilsTile } from "./RoomUtilsTile"
import { useTranslation } from "react-i18next"

interface RoomUtilsSectionProps {
  power?: boolean
  computers?: boolean
  ribaltine?: boolean
}

export const RoomUtilsSection: FC<RoomUtilsSectionProps> = props => {
  const { labelsHighContrast } = usePalette()

  const { t } = useTranslation("freeClass")

  return (
    <View>
      <BodyText
        style={{
          fontSize: 20,
          fontWeight: "900",
          color: labelsHighContrast,
        }}
      >
        {t("freeClass_info")}:
      </BodyText>
      <RoomUtilsTile name={t("freeClass_smallDesk")} status={props.ribaltine} />
      <RoomUtilsTile name={t("freeClass_current")} status={props.power} />
      <RoomUtilsTile name={t("freeClass_computer")} status={props.computers} />
    </View>
  )
}
