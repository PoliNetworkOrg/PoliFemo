import { BodyText } from "components/Text"
import React, { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { Group } from "api/groups"
import { choosePlatformIcon } from "utils/groups"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"

export interface ModalGroupItemProps {
  /**
   * ResetButton
   */
  group?: Group
}

export const ModalGroupItem: FC<ModalGroupItemProps> = props => {
  const { isLight } = usePalette()
  const icon = choosePlatformIcon(props.group?.platform)
  const iconSvg = useSVG(icon?.svg)

  const scaleFactor = 2.5

  return (
    <View
      style={{
        alignItems: "center",
        marginHorizontal: 8,
      }}
    >
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          marginTop: 16,
          marginBottom: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon && iconSvg && (
          <Canvas
            style={{
              width: icon.width * scaleFactor,
              height: icon.heigth * scaleFactor,
            }}
          >
            {iconSvg && (
              <ImageSVG
                svg={iconSvg}
                x={0}
                y={0}
                width={icon.width}
                height={icon.heigth}
                transform={[{ scale: scaleFactor }]}
              />
            )}
          </Canvas>
        )}
      </View>
      <BodyText
        style={{
          fontSize: 32,
          fontWeight: "900",
          color: isLight ? "#414867" : "#fff",
          textAlign: "center",
        }}
      >
        {props.group?.class}
      </BodyText>
      <View>
        {props.group?.members && (
          <BodyText
            style={{
              fontSize: 13,
              fontWeight: "400",
              color: isLight ? "#8791BD" : "#fff",
              textAlign: "center",
            }}
          >
            {props.group.members} members
          </BodyText>
        )}
        <BodyText
          style={{
            fontSize: 13,
            fontWeight: "400",
            color: isLight ? "#414867" : "#fff",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          {props.group?.year}
        </BodyText>
      </View>
    </View>
  )
}
