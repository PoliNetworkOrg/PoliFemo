import { FC } from "react"
import { Pressable, StyleProp, ViewStyle } from "react-native"

// import { usePalette } from "utils/colors"
import { TrayIcon, trayIcons } from "assets/tray"
import { Icon } from "components/Icon"

export const TrayButton: FC<{
  onClick: () => void
  label: TrayIcon
  style?: StyleProp<ViewStyle>
}> = props => {
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
    </Pressable>
  )
}
