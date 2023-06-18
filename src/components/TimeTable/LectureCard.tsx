import { BodyText } from "components/Text"
import { FC, useContext, useEffect, useRef } from "react"
import { Animated, Easing, Pressable, View } from "react-native"
import { Event } from "api/collections/event"
import { TimeTableContext } from "contexts/timeTable"
import { usePalette } from "utils/colors"
import {
  ATTACHED_LECTURES_MARGIN,
  LECTURE_CONTAINER_PADDING,
  LECTURE_HEIGHT_COLLAPSED,
  LECTURE_HEIGHT_COLLAPSED_NOT_SELECTED,
  LECTURE_HEIGHT_OPEN,
  TIME_SLOT,
} from "utils/timetable"
import { SharedValue } from "react-native-reanimated"

export interface LectureCardProps {
  lecture: Event
  borderColor: string
  overlapNumber: number
  onPress: () => void
  isSelected?: boolean
  animatedValue: SharedValue<number>
}

const minHour = 8

/**
 * Component that represents the card that contains the name and the room of the lecture.
 */
export const LectureCard: FC<LectureCardProps> = props => {
  const { timeTableOpen } = useContext(TimeTableContext)

  const { isLight, palette, primary } = usePalette()

  const open = timeTableOpen

  const timeRange =
    Math.abs(
      new Date(props.lecture.date_end).getTime() -
        new Date(props.lecture.date_start).getTime()
    ) / 3600000

  const timeStart = new Date(props.lecture.date_start).getHours() - minHour

  const top =
    props.overlapNumber *
      ((open ? LECTURE_HEIGHT_OPEN : LECTURE_HEIGHT_COLLAPSED_NOT_SELECTED) +
        2 * LECTURE_CONTAINER_PADDING) +
    LECTURE_CONTAINER_PADDING -
    (props.isSelected ? 3 : 0)
  const height = open
    ? LECTURE_HEIGHT_OPEN
    : props.isSelected
    ? LECTURE_HEIGHT_COLLAPSED
    : LECTURE_HEIGHT_COLLAPSED_NOT_SELECTED

  const topAnim = useRef(new Animated.Value(top)).current
  useEffect(() => {
    Animated.timing(topAnim, {
      toValue: top,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start()
  })

  const heightAnim = useRef(new Animated.Value(height)).current
  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: height,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start()
  })

  return (
    <Animated.View
      style={{
        position: "absolute",
        zIndex: 3,
        left: timeStart * TIME_SLOT + ATTACHED_LECTURES_MARGIN + 1,
        top: topAnim,
        width: timeRange * TIME_SLOT - ATTACHED_LECTURES_MARGIN * 2,
        height: heightAnim,
        borderRadius: 18,
        backgroundColor: props.isSelected
          ? props.lecture.lectureColor
          : isLight
          ? primary
          : palette.variant1,
      }}
    >
      <Pressable
        style={{
          height,
          justifyContent: open ? "flex-start" : "center",
          padding: open ? 8 : 0,
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
      {(open || !props.isSelected) && (
        <View
          style={{
            position: "absolute",
            top: -7,
            right: -6,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: props.lecture.lectureColor,
          }}
        />
      )}
    </Animated.View>
  )
}
