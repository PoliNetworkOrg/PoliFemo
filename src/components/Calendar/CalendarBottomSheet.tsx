import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { FC } from "react"
import { usePalette } from "utils/colors"
import { getUsableScreenHeight } from "utils/layout"
import { CalendarBottomSheetHandle } from "./CalendarBottomSheetHandle"
import { Event } from "api/collections/event"
import { CalendarMonthlyEvents } from "./CalendarMonthlyEvents"
import { monthsIt } from "utils/calendar"
import { DateData } from "react-native-calendars"

export interface CalendarBottomSheetProps {
  events: Event[] | null
  currentMonthDateData: DateData
}

const distanceFromTop = {
  closed: 426,
  opened: 106,
}

export const CalendarBottomSheet: FC<CalendarBottomSheetProps> = props => {
  const { background } = usePalette()

  return (
    <BottomSheet
      style={{
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: background,
      }}
      handleComponent={CalendarBottomSheetHandle}
      backgroundStyle={{
        backgroundColor: background,
        borderTopLeftRadius: 33,
        borderTopRightRadius: 33,
      }}
      snapPoints={[
        Math.max(getUsableScreenHeight() - distanceFromTop.closed, 42),
        getUsableScreenHeight() - distanceFromTop.opened,
      ]}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 26,
          backgroundColor: background,
          paddingTop: 30,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        <CalendarMonthlyEvents
          events={props.events ?? []}
          month={monthsIt[props.currentMonthDateData.month]} // TODO: add translation
          year={props.currentMonthDateData.year}
          lan={"it"}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  )
}
