import { BodyText } from "components/Text"
import { FC, useContext } from "react"
import { Pressable } from "react-native"
import { Event } from "api/collections/event"
import { TimeTableContext } from "contexts/timeTable"

export interface LectureCardProps {
  lecture: Event
  borderColor: string
  onPress: () => void
}

const minHour = 8
const timeSlot = 62 // 30(space between) + 32(space occupied by digits)
const weekSlot = 135 // 120(space between) + 15(space occupied by digit)

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
        borderRadius: 18,
        borderWidth: 2,
        padding: open ? 10 : 0,
        borderColor: props.borderColor,
        backgroundColor: open ? undefined : props.borderColor,
        height: open ? 60 : 17,
        width: 30 + timeRange * timeSlot,
        marginLeft: timeStart * timeSlot,
        marginTop: 0 * weekSlot,
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
