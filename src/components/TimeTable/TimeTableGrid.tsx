/* eslint-disable @typescript-eslint/naming-convention */
import { FC, useContext, useEffect, useRef, useState } from "react"
import { Dimensions, View } from "react-native"
import { TimeLine } from "./TimeLine"
import { WeekLine } from "./WeekLine"
import { ScrollView } from "react-native-gesture-handler"
import { LectureCard } from "./LectureCard"
import { Event } from "api/collections/event"
import { BodyText } from "components/Text"
import { getUsableScreenHeight } from "utils/layout"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { TimeTableContext } from "contexts/timeTable"

const { width } = Dimensions.get("window")

const lectures: Event[] = [
  {
    event_id: 127350,
    date_start: "2022-12-22T08:00:00",
    date_end: "2022-12-22T11:00:00",
    show_agenda: true,
    matricola: "100000",
    title: {
      it: "ARCHITETTURA DEI CALCOLATORI E SISTEMI OPERATIVI",
      en: "COMPUTER ARCHITECTURES AND OPERATING SYSTEMS",
    },
    event_type: {
      typeId: 1,
      type_dn: { it: "Lezione", en: "Lecture" },
    },
    event_subtype: "L",
    calendar: {
      calendar_id: 0,
      calendar_dn: { it: "Accademico", en: "Academic" },
    },
    room: {
      room_id: 3316,
      acronym_dn: "2.1.2",
      classroom_id: -2147483648,
      room_dn: "002",
    },
  },
  {
    event_id: 127351,
    date_start: "2022-12-22T09:00:00",
    date_end: "2022-12-22T12:00:00",
    show_agenda: true,
    matricola: "100000",
    title: {
      it: "INGEGNERIA DEL SOFTWARE",
      en: "SOFTWARE ENGINEERING",
    },
    event_type: {
      typeId: 1,
      type_dn: { it: "Lezione", en: "Lecture" },
    },
    event_subtype: "L",
    calendar: {
      calendar_id: 0,
      calendar_dn: { it: "Accademico", en: "Academic" },
    },
    room: {
      room_id: 3316,
      acronym_dn: "2.1.2",
      classroom_id: -2147483648,
      room_dn: "002",
    },
  },
]

const colors: string[] = ["red", "lightblue"]

// distance of the bottom sheet from the top of the screen, when opened or closed
const distanceFromTop = {
  closed: 500,
  opened: 106,
}

export const TimeTableGrid: FC = () => {
  const { timeTableOpen, setTimeTableOpen } = useContext(TimeTableContext)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const [currentLecture, setCurrentLecture] = useState<Event>()

  useEffect(() => {
    if (timeTableOpen) {
      bottomSheetRef.current?.close?.()
    } else {
      bottomSheetRef.current?.snapToPosition(
        getUsableScreenHeight() - distanceFromTop.closed
      )
    }
  }, [timeTableOpen])

  return (
    <>
      <View style={{ flex: 1, width, marginTop: 163, marginLeft: 29 }}>
        <ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "column" }}>
              <TimeLine />
              <WeekLine />
              <View
                style={{ marginLeft: 40, marginTop: 35, position: "absolute" }}
              >
                {lectures.map((lecture, index) => (
                  <LectureCard
                    lecture={lecture}
                    borderColor={colors[index]}
                    onPress={() => {
                      setTimeTableOpen(!timeTableOpen)
                      setCurrentLecture(lecture)
                    }}
                    key={lecture.event_id}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={[
          // 0 is at the bottom of the screen
          getUsableScreenHeight() - distanceFromTop.closed,
        ]}
      >
        <BottomSheetScrollView>
          <BodyText>{currentLecture?.title.it}</BodyText>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  )
}
