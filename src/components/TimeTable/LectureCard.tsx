import { BodyText } from "components/Text"
import { FC, useContext } from "react"
import { Pressable, View } from "react-native"
import { Event } from "api/collections/event"
import { TimeTableContext } from "contexts/timeTable"
import { usePalette } from "utils/colors"
import {
  LECTURE_CONTAINER_PADDING,
  LECTURE_HEIGHT_COLLAPSED,
  LECTURE_HEIGHT_OPEN,
  TIME_SLOT,
} from "utils/timetable"

export interface LectureCardProps {
  lecture: Event
  borderColor: string
  overlapNumber: number
  onPress: () => void
}

const minHour = 8

/**
 * Component that represents the card that contains the name and the room of the lecture.
 */
export const LectureCard: FC<LectureCardProps> = props => {
  const { timeTableOpen } = useContext(TimeTableContext)

  const { isLight, palette } = usePalette()

  const open = timeTableOpen

  const timeRange =
    Math.abs(
      new Date(props.lecture.date_end).getTime() -
        new Date(props.lecture.date_start).getTime()
    ) / 3600000

  const timeStart = new Date(props.lecture.date_start).getHours() - minHour

  return (
    <View
      style={{
        position: "absolute",
        zIndex: 2,
        backgroundColor: isLight ? palette.primary : palette.darker,
        height:
          (open ? LECTURE_HEIGHT_OPEN : LECTURE_HEIGHT_COLLAPSED) +
          2 * LECTURE_CONTAINER_PADDING,
        width: timeRange * TIME_SLOT + 2 * LECTURE_CONTAINER_PADDING,
        left: timeStart * TIME_SLOT + 1 - LECTURE_CONTAINER_PADDING,
        justifyContent: "center",
        alignItems: "center",
        top:
          props.overlapNumber *
          ((open ? LECTURE_HEIGHT_OPEN : LECTURE_HEIGHT_COLLAPSED) +
            2 * LECTURE_CONTAINER_PADDING),
      }}
    >
      <Pressable
        style={{
          width: timeRange * TIME_SLOT,
          height: open ? LECTURE_HEIGHT_OPEN : LECTURE_HEIGHT_COLLAPSED,
          borderRadius: 18,
          borderWidth: 2,
          padding: open ? 10 : 0,
          borderColor: props.borderColor,
          backgroundColor: open ? undefined : props.borderColor,
          justifyContent: "center",
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
    </View>
  )
}
