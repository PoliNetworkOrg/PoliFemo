import { FC } from "react"
import { Pressable, View } from "react-native"
import { Event } from "api/collections/event"
import { Icon } from "components/Icon"
import colorPickerSvg from "assets/timetable/color_picker.svg"

export interface ColorPickerLectureProps {
  lecture?: Event
}

export const ColorPickerLecture: FC<ColorPickerLectureProps> = props => {
  return (
    <Pressable>
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 10,
          marginLeft: 8,
          marginTop: 4,
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon source={colorPickerSvg} />
      </View>
    </Pressable>
  )
}
