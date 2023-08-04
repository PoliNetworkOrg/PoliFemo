import { FC } from "react"
import { Pressable, ViewStyle } from "react-native"
import { usePalette } from "utils/colors"

interface CalendarButton {
  children: React.ReactNode
  onPress?: () => void

  style?: ViewStyle
}

export const CalendarButton: FC<CalendarButton> = props => {
  const { palette } = usePalette()

  return (
    <Pressable
      style={[
        {
          backgroundColor: palette.primary,
          borderRadius: 4,
          height: 28,
          justifyContent: "center",
          alignItems: "center",
          width: 36,
        },
        props.style,
      ]}
      onPress={props.onPress}
    >
      {props.children}
    </Pressable>
  )
}
