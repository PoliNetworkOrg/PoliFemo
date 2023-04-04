/* eslint-disable @typescript-eslint/naming-convention */
import { FC } from "react"
import { Dimensions, View } from "react-native"
import { TimeLine } from "./TimeLine"
import { WeekLine } from "./WeekLine"
import { ScrollView } from "react-native-gesture-handler"
import { LectureCard } from "./LectureCard"

const { width } = Dimensions.get("window")

export const TimeTableGrid: FC = () => {
  return (
    <View style={{ flex: 1, width, marginTop: 163, marginLeft: 29 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TimeLine />
      </ScrollView>
      <ScrollView style={{ marginTop: -50 }}>
        <ScrollView horizontal>
          <WeekLine />
          <View style={{ marginLeft: 35 }}>
            <LectureCard
              lecture={{
                event_id: 127350,
                date_start: "2022-12-22T08:15:00",
                date_end: "2022-12-22T11:15:00",
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
              }}
              borderColor="red"
            />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  )
}
