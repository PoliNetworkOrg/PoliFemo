/* eslint-disable @typescript-eslint/naming-convention */
import { FC, useContext, useEffect, useRef, useState } from "react"
import { Dimensions, View } from "react-native"
import { TimeLine } from "./TimeLine"
import { WeekLine } from "./WeekLine"
import { ScrollView } from "react-native-gesture-handler"
import { Event } from "api/collections/event"
import { BodyText } from "components/Text"
import { getUsableScreenHeight } from "utils/layout"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { TimeTableContext } from "contexts/timeTable"
import {
  formattedTableKeys,
  getFormattedTable,
  getMaxOverlapNumbers,
} from "utils/timetable"
import { TimetableRow } from "./TimetableRow"
import { LoginContext } from "contexts/login"
import { useApiCall } from "api/useApiCall"
import { api } from "api"
import { EventType } from "utils/events"
import moment from "moment"

const { width } = Dimensions.get("window")

/*
const lectures: Event[] = [
  {
    event_id: 127350,
    date_start: "2023-04-10T08:00:00",
    date_end: "2023-04-10T10:00:00",
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
    date_start: "2023-04-10T09:00:00",
    date_end: "2023-04-10T11:00:00",
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
  {
    event_id: 127352,
    date_start: "2023-04-10T10:00:00",
    date_end: "2023-04-10T17:00:00",
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
  {
    event_id: 127350,
    date_start: "2023-04-11T10:00:00",
    date_end: "2023-04-11T16:00:00",
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
    date_start: "2023-04-11T12:00:00",
    date_end: "2023-04-11T18:00:00",
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
  {
    event_id: 127352,
    date_start: "2023-04-12T08:00:00",
    date_end: "2023-04-12T10:00:00",
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
  {
    event_id: 127352,
    date_start: "2023-04-12T09:00:00",
    date_end: "2023-04-12T20:00:00",
    show_agenda: true,
    matricola: "100000",
    title: {
      it: "INGEGNERIA DEL SOFTWARE 2",
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
  {
    event_id: 127352,
    date_start: "2023-04-13T08:00:00",
    date_end: "2023-04-13T19:00:00",
    show_agenda: true,
    matricola: "100000",
    title: {
      it: "INGEGNERIA DEL SOFTWARE 2",
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
  {
    event_id: 127352,
    date_start: "2023-04-14T08:00:00",
    date_end: "2023-04-14T11:00:00",
    show_agenda: true,
    matricola: "100000",
    title: {
      it: "INGEGNERIA DEL SOFTWARE 2",
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
]*/

// distance of the bottom sheet from the top of the screen, when opened or closed
const distanceFromTop = {
  closed: 500,
  opened: 106,
}

export const TimeTableGrid: FC = () => {
  const { timeTableOpen, setTimeTableOpen } = useContext(TimeTableContext)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const [currentLecture, setCurrentLecture] = useState<Event>()

  const { loggedIn, userInfo } = useContext(LoginContext)

  const { matricola } = userInfo?.careers?.[0] ?? {}

  const startDate = new Date().toISOString().substring(0, 10)

  const [lectures, setLectures] = useState<Event[]>([])

  const [events] = useApiCall(
    api.events.getEvents,
    {
      matricola: matricola ?? "",
      startDate,
      nEvents: 100,
    },
    [loggedIn],
    {},
    !loggedIn // only call if logged in
  )

  useEffect(() => {
    if (events && events?.length > 1) {
      setLectures(
        events
          .filter(
            event =>
              //one week range
              new Date(event.date_start) >= moment().toDate() &&
              new Date(event.date_start) <= moment().add(6, "days").toDate()
          )
          .filter(e => e.event_type.typeId === EventType.LECTURES) //filter only the lectures)
      )
    }
  }, [events])

  useEffect(() => {
    if (timeTableOpen) {
      bottomSheetRef.current?.close?.()
    } else {
      bottomSheetRef.current?.snapToPosition(
        getUsableScreenHeight() - distanceFromTop.closed
      )
    }
  }, [timeTableOpen])

  const formattedTable = getFormattedTable(lectures ?? [])

  return (
    <>
      <View
        style={{
          flex: 1,
          width,
          marginTop: 163,
          marginLeft: 29,
          marginBottom: 100,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "row" }}>
            <WeekLine
              overlapsNumberList={getMaxOverlapNumbers(formattedTable)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                marginLeft: 10,
              }}
            >
              <View>
                <TimeLine />
                <View>
                  {formattedTableKeys.map(day => (
                    <TimetableRow
                      onEventPress={(event: Event) => {
                        setTimeTableOpen(!timeTableOpen)
                        setCurrentLecture(event)
                      }}
                      row={formattedTable[day]}
                      key={day}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={[getUsableScreenHeight() - distanceFromTop.closed]}
      >
        <BottomSheetScrollView>
          <BodyText>{currentLecture?.title.it}</BodyText>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  )
}
