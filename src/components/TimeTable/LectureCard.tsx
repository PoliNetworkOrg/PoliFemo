import { BodyText } from "components/Text"
import { FC, useContext } from "react"
import { Pressable } from "react-native"
import { Event } from "api/collections/event"
import { TimeTableContext } from "contexts/timeTable"

export interface LectureCardProps {
  lecture: Event
  borderColor: string
  overlapNumber: number
  onPress: () => void
}

const minHour = 8
const timeSlot = 62 / 2 // 30(space between) + 32(space occupied by digits)

/**
 * Component that represents the card that contains the name and the room of the lecture.
 */
export const LectureCard: FC<LectureCardProps> = props => {
  const { timeTableOpen } = useContext(TimeTableContext)

  const open = timeTableOpen

  const timeRange =
    Math.abs(
      new Date(props.lecture.date_end).getTime() -
        new Date(props.lecture.date_start).getTime()
    ) / 3600000

  const timeStart = new Date(props.lecture.date_start).getHours() - minHour

  return (
    <Pressable
      style={{
        position: "absolute",
        borderRadius: 18,
        borderWidth: 2,
        padding: open ? 10 : 0,
        borderColor: props.borderColor,
        backgroundColor: open ? undefined : props.borderColor,
        height: open ? 60 : 17,
        width: timeRange * timeSlot,
        left: timeStart * timeSlot,
        //TODO: capire se inserire spazio tra lezioni overlappate
        top: props.overlapNumber * (open ? 60 : 17),
      }}
      onPress={() => props.onPress()}
    >
      {open ? (
        <BodyText
          style={{
            color: "white",
            fontSize: 10,
            fontWeight: "900",
            alignSelf: "center",
          }}
        >
          {props.lecture.room?.acronym_dn + " - " + props.lecture.title.it}
        </BodyText>
      ) : (
        <BodyText
          style={{
            color: "white",
            fontSize: 10,
            fontWeight: "900",
            alignSelf: "center",
          }}
        >
          {props.lecture.room?.acronym_dn}
        </BodyText>
      )}
    </Pressable>
  )
}
