import { MainStackScreen } from "navigation/NavigationTypes"
import { useTranslation } from "react-i18next"
import { BoxShadowView } from "components/BoxShadow"
import { NavBar } from "components/NavBar"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { StyleSheet } from "react-native"
import { Calendar } from "react-native-calendars"
import { useEffect, useRef, useState } from "react"
import {
  CalendarPeriod,
  CalendarSingletonWrapper as CalendarManager,
  dayComponentCustom,
  months,
  daysOfWeekLetters,
  CalendarBottomSheetStatus,
  CalendarEvent,
} from "utils/calendar"
import { MarkedDates } from "react-native-calendars/src/types"
import { Text } from "components/Text"
import { Icon } from "components/Icon"
import calendarIcon from "assets/calendar/calendar.svg"
import capeIcon from "assets/calendar/cape_calendar.svg"
import userIcon from "assets/calendar/user_calendar.svg"
import { CalendarPeriodsSwitches } from "components/Calendar/CalendarPeriodsSwitches"
import { CalendarMonthlyEvents } from "components/Calendar/CalendarMonthlyEvents"
import { useCurrentLanguage } from "utils/articles"
import { CalendarAddEvent } from "components/Calendar/CalendarAddEvent"

export const CalendarPage: MainStackScreen<"Calendar"> = () => {
  const { homeBackground, background, dotColor } = usePalette()
  const { t } = useTranslation()

  const lan = useCurrentLanguage()

  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().slice(0, 10)
  )

  const [bottomSheetStatus, setBottomSheetStatus] =
    useState<CalendarBottomSheetStatus>(CalendarBottomSheetStatus.PERIODS)

  const [month, setMonth] = useState<number>(new Date().getMonth())

  const [year, setYear] = useState<number>(new Date().getFullYear())

  const [markedDates, setMarkedDates] = useState<MarkedDates>({})

  const [calendarPeriods, setCalendarPeriods] = useState<
    CalendarPeriod[] | undefined
  >()

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])

  const [calendarEventsMonth, setCalendarEventsMonth] = useState<
    CalendarEvent[]
  >([])

  useEffect(() => {
    console.log(selectedDay)
  }, [selectedDay])

  const calendarObj = useRef<CalendarManager | undefined>()

  useEffect(() => {
    const initCalendar = () => {
      if (!calendarObj.current) {
        calendarObj.current = new CalendarManager()
        calendarObj.current.addListener("markedDatesSet", () => {
          if (calendarObj.current?.markedDatesPeriods) {
            setMarkedDates(calendarObj.current?.markedDatesPeriods)
            setCalendarPeriods(calendarObj.current?.calendarPeriods)
          }
        })

        calendarObj.current.addListener("calendarPeriodsChanged", () => {
          if (calendarObj.current?.calendarPeriods) {
            setCalendarPeriods(calendarObj.current?.calendarPeriods)
          }
        })

        calendarObj.current.addListener("calendarEventsChanged", () => {
          console.log("calendarEventsChanged")
          if (calendarObj.current?.calendarEvents) {
            /* console.log(calendarObj.current?.calendarEvents) */
            setCalendarEvents(calendarObj.current?.calendarEvents)
          }
        })
      } else {
        if (calendarObj.current?.markedDatesPeriods) {
          setMarkedDates(calendarObj.current?.markedDatesPeriods)
          setCalendarPeriods(calendarObj.current?.calendarPeriods)
        }
      }
    }

    initCalendar()

    return () => {
      calendarObj?.current?.removeAllListeners("markedDatesSet")
      calendarObj?.current?.removeAllListeners("calendarPeriodsChanged")
      calendarObj?.current?.removeAllListeners("calendarEventsChanged")
    }
  }, [])

  useEffect(() => {
    if (calendarEvents.length > 0) {
      const filteredEvents = calendarEvents.filter(
        event =>
          new Date(event.start).getMonth() === month &&
          new Date(event.start).getFullYear() === year
      )
      /* console.log(filteredEvents) */
      setCalendarEventsMonth(filteredEvents)
    }
  }, [calendarEvents, month, year])

  return (
    <View style={[{ backgroundColor: homeBackground }, styles.container]}>
      <View
        style={{
          position: "absolute",
          top: 120,
          height: 40,
          width: "100%",
          zIndex: 2,
          paddingHorizontal: 28,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Pressable
            onPress={() => {
              if (bottomSheetStatus === CalendarBottomSheetStatus.PERIODS) {
                setBottomSheetStatus(CalendarBottomSheetStatus.MONTHLY_EVENTS)
              } else {
                setBottomSheetStatus(CalendarBottomSheetStatus.PERIODS)
              }
            }}
          >
            <Icon source={calendarIcon} />
          </Pressable>

          <View style={{ flexDirection: "row" }}>
            <Icon source={userIcon} style={{ marginRight: 8 }} />
            <Icon source={capeIcon} />
          </View>
        </View>
        <View
          style={{
            height: 24,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {daysOfWeekLetters.map((day, index) => (
            <Text
              key={index}
              style={{ fontSize: 12, fontWeight: "900", color: "#fff" }}
            >
              {day}
            </Text>
          ))}
        </View>
        <View style={{ width: "100%", height: 1, backgroundColor: "#fff" }} />
      </View>
      <Calendar
        theme={{
          calendarBackground: homeBackground,
          selectedDayTextColor: "orange",
          todayTextColor: "yellow",
          dayTextColor: "#fff",
          dotStyle: { width: 6, height: 6, borderRadius: 3 },
          dotColor: dotColor,
        }}
        onDayPress={day => {
          setSelectedDay(day.dateString)

          setBottomSheetStatus(CalendarBottomSheetStatus.ADD_EVENT)
        }}
        style={{
          marginTop: 150,
          height: 290,
          backgroundColor: homeBackground,
        }}
        markedDates={{
          ...markedDates,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "2023-07-15": {
            marked: true,
            startingDay: true,
            endingDay: true,
            color: "orange",
          },
        }}
        customHeaderTitle={undefined}
        hideExtraDays={true}
        renderHeader={() => null}
        renderArrow={() => null}
        enableSwipeMonths={true}
        showSixWeeks={true}
        hideDayNames={true}
        markingType="period"
        current={selectedDay}
        onMonthChange={month => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          setMonth(month.month - 1)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          setYear(month.year)
        }}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        dayComponent={dayComponentCustom}
      />
      <BoxShadowView
        shadow={{
          color: "#000",
          offset: { y: -8 },
          opacity: 0.45,
          blur: 32,
        }}
        style={styles.boxShadow}
        contentContainerStyle={[
          { backgroundColor: background },
          styles.boxShadowContainer,
        ]}
      >
        {bottomSheetStatus === CalendarBottomSheetStatus.PERIODS && (
          <CalendarPeriodsSwitches
            calendarPeriods={calendarPeriods}
            month={months[month]}
            year={year}
            onSwitchChange={(value: boolean, title: string) =>
              calendarObj.current?.updatePeriods(title, value)
            }
          />
        )}
        {bottomSheetStatus === CalendarBottomSheetStatus.MONTHLY_EVENTS && (
          <CalendarMonthlyEvents
            events={calendarEventsMonth}
            month={months[month]}
            year={year}
            lan={lan}
          />
        )}
        {bottomSheetStatus === CalendarBottomSheetStatus.ADD_EVENT && (
          <CalendarAddEvent
            addEvent={(event: CalendarEvent) => {
              return
            }}
            date={selectedDay}
          />
        )}
      </BoxShadowView>
      <NavBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxShadow: {
    flex: 1,
    overflow: "visible",
  },
  boxShadowContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "visible",
  },
})
