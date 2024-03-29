import { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"

import tick from "assets/freeClassrooms/tick.svg"
import cross from "assets/freeClassrooms/cross.svg"
import { Icon } from "components/Icon"

interface RoomUtilsTileProps {
  name: string
  status?: boolean
}

export const RoomUtilsTile: FC<RoomUtilsTileProps> = props => {
  const { palette, isLight, sliderBorderColor } = usePalette()

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
      }}
    >
      <View
        style={{
          width: 15,
          height: 15,
          marginRight: 8,
        }}
      >
        {props.status ? (
          <Icon
            source={tick}
            color={isLight ? palette.primary : palette.lighter}
          />
        ) : (
          <Icon
            source={cross}
            color={isLight ? palette.lighter : palette.primary}
          />
        )}
      </View>

      <BodyText
        style={{
          fontSize: 13,
          fontWeight: "400",
          color: sliderBorderColor,
        }}
      >
        {props.name}
      </BodyText>
    </View>
  )
}
