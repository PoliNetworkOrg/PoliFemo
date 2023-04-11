import { FC } from "react"
import { View } from "react-native"
import { Event } from "api/collections/event"
import { LectureRow } from "./LectureRow"
import { ValidTableRow } from "utils/timetable"

export interface TimetableRowProps {
  row: ValidTableRow
  onEventPress: (event: Event) => void
}

export const TimetableRow: FC<TimetableRowProps> = props => {
  return (
    <View
      style={{
        height: (props.row.maxOverlapNumber + 1) * 64,
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
