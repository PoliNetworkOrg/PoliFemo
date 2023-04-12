import { FC } from "react"
import { View } from "react-native"
import { Event } from "api/collections/event"
import { LectureCard } from "./LectureCard"

const colors: string[] = ["red", "lightblue", "white"]

export interface LectureRowProps {
  lectures: Event[]
  overlapNumber: number
  onEventPress: (event: Event) => void
}

export const LectureRow: FC<LectureRowProps> = props => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginLeft: 15,
      }}
    >
      {props.lectures.map((lecture, index) => {
        return (
          <LectureCard
            lecture={lecture}
            borderColor={colors[index]}
            onPress={() => props.onEventPress(lecture)}
            key={lecture.event_id}
            overlapNumber={props.overlapNumber}
          />
        )
      })}
    </View>
  )
}
