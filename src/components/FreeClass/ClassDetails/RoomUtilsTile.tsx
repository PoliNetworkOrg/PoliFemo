import React, { FC, useMemo } from "react"
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
import x from "assets/freeClassrooms/x.svg"

interface RoomUtilsTileProps {
  name: string
  status?: boolean
}

export const RoomUtilsTile: FC<RoomUtilsTileProps> = props => {
  const { sliderBorderColor } = usePalette()

  const tickSvg = useSVG(tick)
  const xSvg = useSVG(x)

  const widthFixed = 15
  const heightFixed = 15
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
          width: widthFixed,
          height: heightFixed,
          marginRight: 8,
        }}
      >
        <Canvas
          style={{
            flex: 1,
            width: widthFixed,
            height: heightFixed,
          }}
        >

          <Group>
            {props.status ? (
              (tickSvg ? <ImageSVG svg={tickSvg} x={0} y={0} width={widthFixed} height={heightFixed} /> : null)
            ) : (
              (xSvg ? <ImageSVG svg={xSvg} x={-10} y={-30} width={widthFixed} height={heightFixed}  /> : null)
            )}
          </Group>
        </Canvas>
      </View>
      
      <BodyText
        style={{
          fontSize: 13,
          fontWeight: "400",
          color: sliderBorderColor,
        }}
      >
        {props.name} {props.status}
      </BodyText>
    </View>
  )
}
