import { BodyText } from "components/Text"
import { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { CORRECTION_TIMELINE_FACTOR, TIME_SLOT } from "utils/timetable"

export const TimeLine: FC = () => {
  const { isLight, primary } = usePalette()

  const times: string[] = [
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
  ]

  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 8,
        borderBottomWidth: 1,
        borderColor: isLight ? primary : "#fff",
        paddingBottom: 8,
        marginRight: 32,
      }}
    >
      {times.map((item, index) => (
        <BodyText
          style={{
            fontWeight: "900",
            fontSize: 12,
            color: isLight ? primary : "#fff",
            marginRight: TIME_SLOT + CORRECTION_TIMELINE_FACTOR,
          }}
          key={index}
        >
          {item}
        </BodyText>
      ))}
    </View>
  )
}
