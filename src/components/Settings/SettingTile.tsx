import React, { FC, useMemo } from "react"
import { ActivityIndicator, View } from "react-native"
import { TouchableRipple } from "../TouchableRipple"
import {
  BlendMode,
  Canvas,
  Group,
  ImageSVG,
  Skia,
  useSVG,
} from "@shopify/react-native-skia"
import { BodyText, Text } from "components/Text"
import { Divider } from "components/Divider"
import { usePalette } from "utils/colors"
import { IconProps } from "assets/settings"

/**
 * interface representing a setting's UI fields
 */
export interface SettingOptions {
  title: string
  subtitle?: string
  icon?: IconProps
  callback?: () => void
  loading?: boolean
}

export interface SettingTileProps {
  setting: SettingOptions
}

export const SettingTile: FC<SettingTileProps> = props => {
  const icon = props.setting.icon ?? null
  const iconSvg = useSVG(icon?.svg)
  const { articleSubtitle } = usePalette()

  //changing icon color
  //from: https://github.com/Shopify/react-native-skia/issues/462
  const paint = useMemo(() => Skia.Paint(), [])
  paint.setColorFilter(
    Skia.ColorFilter.MakeBlend(Skia.Color(articleSubtitle), BlendMode.SrcIn)
  )

  return (
    <View>
      {props.setting.title === "Disconnetti" && <Divider />}
      {props.setting.loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "#0003",
          }}
        >
          <ActivityIndicator size="large" color={articleSubtitle} />
        </View>
      ) : null}
      <TouchableRipple
        onClick={() => {
          if (!props.setting.loading) props.setting.callback?.()
        }}
        isRoundedTopCorners={false}
      >
        <View
          style={{
            paddingVertical: 22,
            paddingHorizontal: 32,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {iconSvg && icon && (
            <View
              style={{
                width: 24, // max icon width
                height: 24, // max icon height
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Canvas
                style={{
                  flex: 1,
                  width: icon?.width,
                  height: icon?.heigth,
                }}
              >
                <Group layer={paint}>
                  <ImageSVG
                    svg={iconSvg}
                    x={0}
                    y={0}
                    width={icon.width}
                    height={icon.heigth}
                  />
                </Group>
              </Canvas>
            </View>
          )}

          <View style={{ marginLeft: icon ? 20 : 0 }}>
            <BodyText>{props.setting.title}</BodyText>
            {props.setting.subtitle && (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: articleSubtitle,
                }}
              >
                {props.setting.subtitle}
              </Text>
            )}
          </View>
        </View>
      </TouchableRipple>
    </View>
  )
}
