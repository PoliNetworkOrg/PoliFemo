import { BodyText } from "components/Text"
import { FC, useState } from "react"
import { Pressable } from "react-native"
import { Event } from "api/collections/event"

export interface LectureCardProps {
  lecture: Event
  borderColor: string
}

const minHour = 8
const timeSlot = 62 // 30(space between) + 32(space occupied by digits)
const weekSlot = 135 // 120(space between) + 15(space occupied by digit)

/**
 * Component that represents the card that contains the name and the room of the lecture.
 */
export const LectureCard: FC<LectureCardProps> = props => {
  const [open, setOpen] = useState<boolean>(true)

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
      onPress={() => (open ? setOpen(false) : setOpen(true))}
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
