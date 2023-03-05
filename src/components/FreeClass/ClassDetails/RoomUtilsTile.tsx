import { FC, useMemo } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"

import {
  BlendMode,
  Canvas,
  Group,
  ImageSVG,
  Skia,
  useSVG,
} from "@shopify/react-native-skia"
import tick from "assets/freeClassrooms/tick.svg"
import { Icon } from "components/Icon"

interface RoomUtilsTileProps {
  name: string
  status?: boolean
}

export const RoomUtilsTile: FC<RoomUtilsTileProps> = props => {
  const { palette, isLight, sliderBorderColor } = usePalette()

  const tickSvg = useSVG(tick)

  const paintTick = useMemo(() => Skia.Paint(), [])
  paintTick.setColorFilter(
    Skia.ColorFilter.MakeBlend(
      Skia.Color(
        props.status
          ? isLight
            ? palette.primary
            : palette.lighter
          : isLight
          ? palette.lighter
          : palette.primary
      ),
      BlendMode.SrcIn
    )
  )

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
          <Icon source={tick} color={
            props.status
            ? isLight
              ? palette.primary
              : palette.lighter
            : isLight
            ? palette.lighter
            : palette.primary
          } />
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
