import { FC } from "react"
import { Pressable, View } from "react-native"
import { Icon } from "components/Icon"
import colorPickerSvg from "assets/timetable/color_picker.svg"

export interface ColorPickerLectureProps {
  color?: string
  onPress?: () => void
}

export const ColorPickerLecture: FC<ColorPickerLectureProps> = props => {
  return (
    <Pressable onPress={props.onPress}>
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 10,
          marginLeft: 8,
          marginTop: 4,
          backgroundColor: props.color ?? "grey",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon source={colorPickerSvg} />
      </View>
    </Pressable>
  )
}
