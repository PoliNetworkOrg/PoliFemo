import { BodyText } from "components/Text"
import { FC, useState } from "react"
import { Pressable } from "react-native"

export interface LectureCardProps {
  name: string
  borderColor: string
}

export const LectureCard: FC<LectureCardProps> = props => {
  const [open, setOpen] = useState<boolean>(true)

  return (
    <Pressable
      style={{
        borderRadius: 18,
        borderWidth: 2,
        padding: open ? 10 : 0,
        borderColor: props.borderColor,
        height: open ? undefined : 17,
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
          {props.name}
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
          {props.name.split(" -")[0]}
        </BodyText>
      )}
    </Pressable>
  )
}
