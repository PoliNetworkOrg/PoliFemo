import { BodyText } from "components/Text"
import { TimeTableContext } from "contexts/timeTable"
import { FC, useContext } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"

interface WeekLineProps {
  overlapsNumberList: number[]
  overlapsNumberListCollapsed: number[]
}

export const WeekLine: FC<WeekLineProps> = props => {
  const { timeTableOpen } = useContext(TimeTableContext)

  const { isLight, primary } = usePalette()

  const days = ["L", "M", "M", "G", "V", "S"]
  return (
    <View style={{ flexDirection: "row", marginTop: 34 }}>
      <View
        style={{
          flexDirection: "column",
          borderRightWidth: 1,
          borderColor: isLight ? primary : "white",
          padding: 10,
          height: timeTableOpen
            ? props.overlapsNumberList[6]
            : props.overlapsNumberListCollapsed[6],
        }}
      >
        {days.map((item, index) => (
          <BodyText
            style={{
              position: "absolute",
              fontWeight: "900",
              fontSize: 12,
              color: isLight ? primary : "#fff",
              top: timeTableOpen
                ? props.overlapsNumberList[index] - 4
                : props.overlapsNumberListCollapsed[index] - 4,
              left: 0,
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
