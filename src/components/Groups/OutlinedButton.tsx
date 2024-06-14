import { BodyText } from "components/Text"
import { FC } from "react"
import { Pressable, StyleProp, ViewStyle } from "react-native"
import { usePalette } from "utils/colors"
import { StyleSheet } from "react-native"
export interface OutlinedButtonProps {
  text?: string
  /**
   * ResetButton
   */
  isSpecial?: boolean
  isSelected?: boolean
  onPress?: () => void
  buttonStyle?: StyleProp<ViewStyle>
}

export const OutlinedButton: FC<OutlinedButtonProps> = props => {
  const { isLight } = usePalette()
  return (
    <Pressable
      style={[
        styles.button,
        {
          borderColor: isLight
            ? props.isSpecial
              ? "#8791BD"
              : "#424967"
            : props.isSpecial
              ? "#fff"
              : "#8791BD",
          backgroundColor: props.isSelected
            ? isLight
              ? "#424967"
              : "#FFB544"
            : "transparent",
        },
        props.buttonStyle,
      ]}
      onPress={props.onPress}
    >
      <BodyText
        style={{
          paddingHorizontal: 8,
          color: isLight ? (props.isSelected ? "#fff" : "#000") : "#fff",
          fontSize: 13,
          fontWeight: "600",
        }}
      >
        {props.text}
      </BodyText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    height: 32,
    minWidth: 100,
    borderRadius: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
})
