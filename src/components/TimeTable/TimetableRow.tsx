import { FC } from "react"
import { View } from "react-native"
import { Event } from "api/collections/event"
import { Subjects, ValidTableRow } from "utils/timetable"
import { LectureCard } from "./LectureCard"
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated"

//TODO : migliorare l'assegnazione del border color
const colors: string[] = ["red", "lightblue", "white"]

export interface TimetableRowProps {
  row: ValidTableRow
  onEventPress: (event: Event) => void
  selectedLectureId?: number
  animatedValue: SharedValue<number>
  subjects: Subjects
}

export const TimetableRow: FC<TimetableRowProps> = props => {
  const topAnim = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            props.animatedValue.value,
            [-1, 0],
            [props.row.marginTop, props.row.collapsedMarginTop]
          ),
        },
      ],
    }
  }, [props.animatedValue])

  return (
    <Animated.View style={[{ zIndex: 1 }, topAnim]}>
      {props.row.singleRows.map((lectures, index) => {
        return (
          <View
            style={{
              flexDirection: "row",
              marginLeft: 15,
            }}
            key={index}
          >
            {lectures.events.map((lecture, index) => {
              if (props.subjects[lecture.title.it] === true) {
                return (
                  <LectureCard
                    animatedValue={props.animatedValue}
                    lecture={lecture}
                    borderColor={colors[index]}
                    onPress={() => props.onEventPress(lecture)}
                    key={lecture.event_id}
                    overlapNumber={lectures.overlapNumber}
                    isSelected={lecture.event_id === props.selectedLectureId}
                  />
                )
              }
            })}
          </View>
        )
      })}
    </Animated.View>
  )
}
