import { BodyText } from "components/Text"
import { FC } from "react"
import { View } from "react-native"
import { CORRECTION_TIMELINE_FACTOR, TIME_SLOT } from "utils/timetable"

export const TimeLine: FC = () => {
  const times: string[] = [
    "08:00",
    /* "09:00", */
    "10:00",
    /* "11:00", */
    "12:00",
    /*  "13:00", */
    "14:00",
    /* "15:00", */
    "16:00",
    /* "17:00", */
    "18:00",
    /* "19:00", */
    "20:00",
  ]

  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 8,
        borderBottomWidth: 1,
        borderColor: "white",
        paddingBottom: 8,
        marginRight: 32,
      }}
    >
      {times.map((item, index) => (
        <BodyText
          style={{
            fontWeight: "900",
            fontSize: 12,
            color: "white",
            //-0.7 for correction
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
