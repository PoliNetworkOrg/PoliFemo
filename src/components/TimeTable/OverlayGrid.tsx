import { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { LECTURE_WIDTH } from "utils/timetable"

export const Grid: FC = () => {
  const { isLight, primary } = usePalette()

  return (
    <View
      style={{ flexDirection: "row", height: "100%", position: "absolute" }}
    >
      {[0, 1, 2, 3, 4, 5, 6].map((item, index) => (
        <View
          key={index}
          style={{
            position: "absolute",
            zIndex: 0,
            height: "100%",
            width: 0.5,
            backgroundColor: isLight ? primary : "#fff",
            left: item * LECTURE_WIDTH + 16,
          }}
        />
      ))}
    </View>
  )
}
