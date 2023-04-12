import { BodyText } from "components/Text"
import { TimeTableContext } from "contexts/timeTable"
import { FC, useContext } from "react"
import { View } from "react-native"

interface WeekLineProps {
  overlapsNumberList: number[]
}

export const WeekLine: FC<WeekLineProps> = props => {
  const { timeTableOpen } = useContext(TimeTableContext)

  const days = ["L", "M", "M", "G", "V", "S"]
  return (
    <View style={{ flexDirection: "row", marginTop: 30 }}>
      <View
        style={{
          flexDirection: "column",
          borderRightWidth: 1,
          borderColor: "white",
          paddingRight: 10,
        }}
      >
        {days.map((item, index) => (
          <BodyText
            style={{
              fontWeight: "900",
              fontSize: 12,
              color: "white",
              //TODO: capire la quantità corretta da mettere per il margine
              marginBottom: timeTableOpen
                ? (props.overlapsNumberList[index] + 1) * 60 - 18
                : 30,
            }}
            key={index}
          >
            {item}
          </BodyText>
        ))}
      </View>
    </View>
  )
}
