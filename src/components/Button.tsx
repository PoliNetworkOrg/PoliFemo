import { FC } from "react"
import { Pressable, StyleSheet, ViewStyle } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"

export interface ButtonCustomProps {
  text?: string
  /**
   * when true the button is "light type" in Light Mode and "dark type"
   * in Dark Mode
   */
  light?: boolean
  onPress?: () => void
  style?: ViewStyle
}
/**
 * Custom button component. Specify param `light` to select button type
 *
 */
export const ButtonCustom: FC<ButtonCustomProps> = props => {
  const { palette, isLight } = usePalette()
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: props.light
            ? isLight
              ? palette.lighter
              : palette.darker
            : isLight
            ? palette.darker
            : palette.lighter,
          minWidth: 130,
        },
        props.style,
      ]}
      onPress={props.onPress}
    >
      <Text style={{ paddingHorizontal: 8 }}>{props.text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 32,
    minWidth: 33,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
})
