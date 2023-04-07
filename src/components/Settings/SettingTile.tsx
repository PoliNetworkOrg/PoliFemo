import { FC } from "react"
import { ActivityIndicator, View } from "react-native"
import { TouchableRipple } from "../TouchableRipple"

import { BodyText, Text } from "components/Text"
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

export const SettingTile: FC<SettingOptions> = props => {
  const icon = props.icon ?? null
  const { articleSubtitle } = usePalette()

  return (
    <View>
      {props.loading ? (
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
          if (!props.loading) props.callback?.()
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
          {icon ? (
            <View style={{ width: 24, alignItems: "center" }}>
              <Icon source={icon} color={articleSubtitle} />
            </View>
          ) : null}

          <View style={{ marginLeft: icon ? 20 : 0 }}>
            <BodyText>{props.title}</BodyText>
            {props.subtitle && (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: articleSubtitle,
                }}
              >
                {props.subtitle}
              </Text>
            )}
          </View>
        </View>
      </TouchableRipple>
    </View>
  )
}
