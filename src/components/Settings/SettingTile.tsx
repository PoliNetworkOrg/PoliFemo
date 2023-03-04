import { FC } from "react"
import { ActivityIndicator, View } from "react-native"
import { TouchableRipple } from "../TouchableRipple"

import { BodyText, Text } from "components/Text"
import { Divider } from "components/Divider"
import { usePalette } from "utils/colors"
import { Icon } from "components/Icon"

/**
 * interface representing a setting's UI fields
 */
export interface SettingOptions {
  title: string
  subtitle?: string
  icon?: number
  callback?: () => void
  loading?: boolean
}

export interface SettingTileProps {
  setting: SettingOptions
}

export const SettingTile: FC<SettingTileProps> = props => {
  const icon = props.setting.icon ?? null
  const { articleSubtitle } = usePalette()

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
            paddingVertical: 14,
            paddingHorizontal: 32,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {icon ? <Icon source={icon} color={articleSubtitle} /> : null}

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
