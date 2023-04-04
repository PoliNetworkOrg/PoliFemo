import { BodyText } from "components/Text"
import { FC, useState } from "react"
import { Pressable } from "react-native"
import { Event } from "api/collections/event"

export interface LectureCardProps {
  lecture: Event
  borderColor: string
}

/**
 * Component that represents the card that contains the name and the room of the lecture.
 */
export const LectureCard: FC<LectureCardProps> = props => {
  const [open, setOpen] = useState<boolean>(true)

  return (
    <Pressable
      style={{
        borderRadius: 18,
        borderWidth: 2,
        padding: open ? 10 : 0,
        borderColor: props.borderColor,
        backgroundColor: open ? undefined : props.borderColor,
        height: open ? 90 : 17,
        width: 108,
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
