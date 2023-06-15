import { FC } from "react"
import { View } from "react-native"
import { TouchableRipple } from "components/TouchableRipple"
import { Button } from "components/Button"
import { CareerColumn } from "./CareerColumn"
import { useTranslation } from "react-i18next"
import { Career } from "api/collections/user"

export interface CareerTileProps {
  career: Career
  onPress: () => void
}

/**
 * Custom Tile component designed to show a "University Career"
 * and a button to open a modal.
 */
export const CareerTile: FC<CareerTileProps> = props => {
  const { t } = useTranslation("settings")

  return (
    <TouchableRipple>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
          paddingLeft: 28,
          paddingRight: 46,
        }}
      >
        <Button
          onPress={props.onPress}
          text={"" + t("settings_changeId")}
          style={{ paddingHorizontal: 8 }}
        />
        <CareerColumn career={props.career} />
      </View>
    </TouchableRipple>
  )
}
