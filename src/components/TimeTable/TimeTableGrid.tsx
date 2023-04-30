/* eslint-disable @typescript-eslint/naming-convention */
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react"
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
  FormattedTable,
  TimetableDeducer,
  getFormattedTable,
  getLectureRoomFormattedString,
  getMarginDays,
  getMarginDaysCollapsed,
  getTimeIntervalFormattedString,
} from "utils/timetable"
import { TimetableRow } from "./TimetableRow"
import { LoginContext } from "contexts/login"
import { Grid } from "./OverlayGrid"
import { usePalette } from "utils/colors"
import { ColorPickerLecture } from "./ColorPickerLecture"
import { useFocusEffect } from "@react-navigation/native"

const { width } = Dimensions.get("window")

const fakeLectures: Event[] = [
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
    event_id: 1251,
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
    event_id: 1231234,
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
    event_id: 12314,
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
    event_id: 5868,
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
    event_id: 125115,
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
    event_id: 1353452,
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
    event_id: 1241551,
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
    event_id: 125151,
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
]

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

  const [formattedTable, setFormattedTimetable] = useState<FormattedTable>(
    getFormattedTable([])
  )

  const [selectedLectureId, setSelectedLectureId] = useState<
    number | undefined
  >(undefined)

  const { isLight, palette } = usePalette()

  const deducer = useRef<TimetableDeducer | undefined>()

  // ? Maybe this can be improved and made without using event emitters?
  useEffect(() => {
    const handleTimeTableEvent = () => {
      if (matricola && loggedIn && !deducer.current) {
        deducer.current = new TimetableDeducer(matricola)
        deducer.current.addListener("timetable_retrieved", () => {
          if (deducer?.current?.timetable?.table) {
            setFormattedTimetable({ ...deducer?.current?.timetable?.table })
          }
        })
      }
    }

    handleTimeTableEvent()

    return () => {
      deducer?.current?.removeListener(
        "timetable_retrieved",
        handleTimeTableEvent
      )
    }
  }, [matricola, loggedIn])

  useEffect(() => {
    if (timeTableOpen) {
      bottomSheetRef.current?.close?.()
      setSelectedLectureId(undefined)
    } else {
      bottomSheetRef.current?.snapToPosition(
        getUsableScreenHeight() - distanceFromTop.closed
      )
    }
  }, [timeTableOpen])

  useFocusEffect(
    useCallback(() => {
      return () => bottomSheetRef.current?.close()
    }, [])
  )

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
              overlapsNumberList={getMarginDays(formattedTable)}
              overlapsNumberListCollapsed={getMarginDaysCollapsed(
                formattedTable
              )}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                paddingLeft: 10,
              }}
            >
              <View>
                <TimeLine />
                <View style={{ height: "100%" }}>
                  {Object.keys(formattedTable).map(day => {
                    const _day = day as keyof FormattedTable
                    return (
                      <TimetableRow
                        onEventPress={(event: Event) => {
                          /* setTimeTableOpen(!timeTableOpen) */
                          if (timeTableOpen) {
                            //set lecture and open bottom sheet
                            setTimeTableOpen(!timeTableOpen)
                            setCurrentLecture(event)
                            setSelectedLectureId(event.event_id)
                          } else if (
                            currentLecture?.event_id === event.event_id
                          ) {
                            //close bottom sheet if click on same lecture
                            setTimeTableOpen(!timeTableOpen)
                            setCurrentLecture(event)
                            setSelectedLectureId(event.event_id)
                          } else {
                            //set lecture and bottom sheet remains open
                            setCurrentLecture(event)
                            setSelectedLectureId(event.event_id)
                          }
                        }}
                        row={formattedTable[_day]}
                        selectedLectureId={selectedLectureId}
                        key={day}
                      />
                    )
                  })}

                  <Grid />
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
        enablePanDownToClose={true}
        onClose={() => setTimeTableOpen(true)}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ marginHorizontal: 36, marginTop: 4 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <BodyText
                style={{
                  fontSize: 20,
                  fontWeight: "900",
                  color: isLight ? palette.variant3 : "#fff",
                }}
              >
                {currentLecture?.title.it}
              </BodyText>
            </View>
            <ColorPickerLecture
              color={currentLecture?.lectureColor}
              onPress={() => {
                if (deducer.current) {
                  deducer.current.changeColor(currentLecture?.event_id)
                }
              }}
            />
          </View>
          <View style={{ marginTop: 32 }}>
            <BodyText
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: isLight ? palette.variant3 : "#fff",
              }}
            >
              {getTimeIntervalFormattedString(
                currentLecture?.date_start,
                currentLecture?.date_end
              )}
            </BodyText>
            <BodyText
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: isLight ? palette.variant3 : "#fff",
              }}
            >
              {getLectureRoomFormattedString(currentLecture?.room?.acronym_dn)}
            </BodyText>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  )
}
