import { FC } from "react"
import { Pressable, StyleProp, View, ViewStyle } from "react-native"
import { TrayIcon, trayIcons } from "assets/tray"
import { Icon } from "components/Icon"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"

export const TrayButton: FC<{
  onClick: () => void
  label: TrayIcon
  style?: StyleProp<ViewStyle>
  badgeCount?: number
}> = props => {
  const { palette } = usePalette()

  const badgeCount = props.badgeCount

  return (
    <Pressable
      onPress={props.onClick}
      style={[
        {
          marginRight: 17,
          marginLeft: 0,
        },
        props.style,
      ]}
    >
      <Icon source={trayIcons[props.label]} />
      {badgeCount && (
        <View
          style={{
            position: "absolute",
            right: -4,
            top: -10,
            width: 16,
            height: 16,
            backgroundColor: palette.accent,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 9, color: palette.variant1 }}>
            {badgeCount}
          </Text>
        </View>
      )}
    </Pressable>
  )
}
