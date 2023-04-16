import { FC, useContext } from "react"
import { View } from "react-native"
import { Event } from "api/collections/event"
import { LectureRow } from "./LectureRow"
import { ValidTableRow } from "utils/timetable"
import { TimeTableContext } from "contexts/timeTable"

export interface TimetableRowProps {
  row: ValidTableRow
  onEventPress: (event: Event) => void
}

export const TimetableRow: FC<TimetableRowProps> = props => {
  const { timeTableOpen } = useContext(TimeTableContext)
  return (
    <View
      style={{
        position: "absolute",
        zIndex: 1,
        top: timeTableOpen ? props.row.marginTop : props.row.collapsedMarginTop,
      }}
    >
      {props.row.singleRows.map((lectures, index) => {
        return (
          <LectureRow
            overlapNumber={lectures.overlapNumber}
            lectures={lectures.events}
            onEventPress={props.onEventPress}
            key={index}
          />
        )
      })}
    </View>
  )
}
