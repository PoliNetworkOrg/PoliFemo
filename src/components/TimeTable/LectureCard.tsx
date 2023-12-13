import { BodyText } from "components/Text"
import { FC, useEffect } from "react"
import { Pressable, StyleSheet } from "react-native"
import { Event } from "api/collections/event"
import { usePalette } from "utils/colors"
import {
  ATTACHED_LECTURES_MARGIN,
  LECTURE_CONTAINER_PADDING,
  LECTURE_HEIGHT_COLLAPSED,
  LECTURE_HEIGHT_COLLAPSED_NOT_SELECTED,
  LECTURE_HEIGHT_OPEN,
  TIME_SLOT,
} from "utils/timetable"
import Animated, {
  Easing,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useCurrentLanguage } from "utils/language"

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
  const { palette } = usePalette()

  const lan = useCurrentLanguage()

  const timeRange =
    Math.abs(
      new Date(props.lecture.date_end).getTime() -
        new Date(props.lecture.date_start).getTime()
    ) / 3600000

  const timeStart = new Date(props.lecture.date_start).getHours() - minHour

  // animation that goes from 0 to 1 if the card is selected
  const selectedAnim = useSharedValue(0)
  useEffect(() => {
    // animate the card when it is selected
    selectedAnim.value = withTiming(props.isSelected ? 1 : 0, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    })
  }, [props.isSelected, selectedAnim])

  const cardStyle = useAnimatedStyle(() => {
    // the height of the card when it is collapsed
    // changes in case the card is selected
    const collapsedHeight = interpolate(
      selectedAnim.value,
      [0, 1],
      [LECTURE_HEIGHT_COLLAPSED_NOT_SELECTED, LECTURE_HEIGHT_COLLAPSED]
    )
    // the color of the card when it is collapsed
    // changes in case the card is selected
    const collapsedColor = interpolateColor(
      selectedAnim.value,
      [0, 1],
      [palette.variant1, props.lecture.lectureColor ?? "black"]
    )
    // the height of a previous card
    const prevHeight =
      interpolate(
        props.animatedValue.value,
        [-1, 0],
        [LECTURE_HEIGHT_OPEN, LECTURE_HEIGHT_COLLAPSED_NOT_SELECTED]
      ) +
      2 * LECTURE_CONTAINER_PADDING

    return {
      // interpolate height of card from open to closed,
      height: interpolate(
        props.animatedValue.value,
        [-1, 0],
        [LECTURE_HEIGHT_OPEN, collapsedHeight]
      ),
      // calculate top offset for each card,
      top:
        props.overlapNumber * prevHeight +
        LECTURE_CONTAINER_PADDING -
        interpolate(selectedAnim.value, [0, 1], [0, 3]),
      // background color of the card
      backgroundColor: interpolateColor(
        props.animatedValue.value,
        [-1, 0],
        [palette.variant1, collapsedColor]
      ),
    }
  }, [selectedAnim, props.animatedValue, props.lecture.lectureColor])

  const abbreviatedOpacity = useAnimatedStyle(
    () => ({
      opacity: interpolate(props.animatedValue.value, [-0.5, 0], [0, 1]),
    }),
    [props.animatedValue]
  )

  const fullOpacity = useAnimatedStyle(
    () => ({
      opacity: interpolate(props.animatedValue.value, [-1, -0.5], [1, 0]),
    }),
    [props.animatedValue]
  )

  const previewColor = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        props.animatedValue.value,
        [-1, 0],
        [1, interpolate(selectedAnim.value, [0, 1], [1, 0])]
      ),
    }),
    [props.animatedValue, selectedAnim]
  )

  const lectureName =
    lan === "it"
      ? props.lecture.title.it
      : props.lecture.title.en ?? props.lecture.title.it

  return (
    <Animated.View
      style={[
        {
          left: timeStart * TIME_SLOT + ATTACHED_LECTURES_MARGIN + 1,
          width: timeRange * TIME_SLOT - ATTACHED_LECTURES_MARGIN * 2,
        },
        styles.container,
        cardStyle,
      ]}
    >
      <Pressable style={styles.pressable} onPress={() => props.onPress()}>
        <Animated.View
          style={[{ padding: 8 }, styles.cardTextContainer, fullOpacity]}
        >
          <BodyText style={styles.cardText}>
            {props.lecture.room?.acronym_dn + " - " + lectureName}
          </BodyText>
        </Animated.View>
        <Animated.View
          style={[
            {
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            },
            styles.cardTextContainer,
            abbreviatedOpacity,
          ]}
        >
          <BodyText style={styles.cardText}>
            {props.lecture.room?.acronym_dn}
          </BodyText>
        </Animated.View>
      </Pressable>
      <Animated.View
        style={[
          {
            backgroundColor: props.lecture.lectureColor,
          },
          styles.preview,
          previewColor,
        ]}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 3,
    borderRadius: 18,
  },
  pressable: {
    flex: 1,
    overflow: "hidden",
    ùborderRadius: 18,
  },
  cardTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
    width: "100%",
  },
  cardText: {
    color: "white",
    fontSize: 10,
    fontWeight: "900",
    alignSelf: "center",
  },
  preview: {
    position: "absolute",
    top: -7,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
})
