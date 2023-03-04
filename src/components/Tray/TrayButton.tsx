import { FC } from "react"
import { Pressable } from "react-native"

// import { usePalette } from "utils/colors"
import { TrayIcon, trayIcons } from "assets/tray"
import { Icon } from "components/Icon"

export const TrayButton: FC<{
  onClick: () => void
  label: TrayIcon
}> = props => {
  return (
    <Pressable
      onPress={props.onClick}
      style={{
        marginRight: 17,
        marginLeft: 0,
      }}
    >
      <Icon source={trayIcons[props.label]} />
    </Pressable>
  )
}
