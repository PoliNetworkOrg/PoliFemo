import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
/* import { useTranslation } from "react-i18next" */
import { BoxShadowView } from "components/BoxShadow"
import { NavBar } from "components/NavBar"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { StyleSheet } from "react-native"
import { Calendar } from "react-native-calendars"
import { useContext, useEffect, useRef, useState } from "react"
import {
  CalendarPeriod,
  CalendarSingletonWrapper as CalendarManager,
  dayComponentCustom,
  daysOfWeekLetters,
  CalendarBottomSheetStatus,
  CalendarEvent,
  monthsIt,
  monthsEn,
  CalendarEventStatus,
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
import { LoginContext } from "contexts/login"
import { CalendarEventDetails } from "components/Calendar/CalendarEventDetails"
import { CalendarDailyEvents } from "components/Calendar/CalendarDailyEvents"

export const CalendarPage: MainStackScreen<"Calendar"> = () => {
  const { homeBackground, background, dotColor } = usePalette()

  // todo : implement translation :(
  /* const { t } = useTranslation() */

  const { userInfo } = useContext(LoginContext)

  const { matricola } = userInfo?.careers?.[0] ?? {}

  const lan = useCurrentLanguage()

  const [selectedDay, setSelectedDay] = useState(new Date().toISOString())

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

  const [calendarEventsDaily, setCalendarEventsDaily] = useState<
    CalendarEvent[]
  >([])

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(
    undefined
  )

  const navigation = useNavigation()

  /* useEffect(() => {
    console.log(selectedDay)
  }, [selectedDay]) */

  const calendarObj = useRef<CalendarManager | undefined>()

  useEffect(() => {
    const initCalendar = () => {
      if (!calendarObj.current) {
        calendarObj.current = new CalendarManager({
          hidePeriods: false,
          matricola: matricola,
        })
        calendarObj.current.addListener("markedDatesSet", () => {
          if (calendarObj.current?.markedDatesPeriods) {
            console.log("marked dates sets")
            setMarkedDates(calendarObj.current?.markedDatesPeriods)
            setCalendarPeriods(calendarObj.current?.calendarPeriods)
          }
        })

        calendarObj.current.addListener("calendarPeriodsChanged", () => {
          if (calendarObj.current?.calendarPeriods) {
            console.log("calendarPeriodsChanged")
            setCalendarPeriods(calendarObj.current?.calendarPeriods)
          }
        })

        calendarObj.current.addListener("calendarEventsChanged", () => {
          if (calendarObj.current?.calendarEvents) {
            console.log("calendarEventsChanged")
            setCalendarEvents([...(calendarObj.current?.calendarEvents ?? [])])
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

      setCalendarEventsMonth(filteredEvents)
    }
  }, [calendarEvents, month, year])

  useEffect(() => {
    if (calendarEvents.length > 0) {
      const filteredEvents = calendarEvents.filter(
        event =>
          new Date(event.start).getDate() === new Date(selectedDay).getDate() &&
          new Date(event.start).getMonth() === month &&
          new Date(event.start).getFullYear() === year
      )

      setCalendarEventsDaily(filteredEvents)
    }
  }, [calendarEvents, selectedDay])

  // hide or show peridos based on bottom sheet status
  useEffect(() => {
    if (bottomSheetStatus !== CalendarBottomSheetStatus.PERIODS) {
      if (calendarObj.current?.hidePeriods == false) {
        calendarObj.current?.hideAllPerdiods()
      }
    } else if (bottomSheetStatus === CalendarBottomSheetStatus.PERIODS) {
      calendarObj.current?.showSwitchedOnPeriods()
    }
  }, [bottomSheetStatus])

  // change matricola
  useEffect(() => {
    if (
      calendarObj.current &&
      matricola &&
      calendarObj.current.matricola !== matricola
    ) {
      calendarObj.current?.changeMatricola(matricola)
    }
  }, [matricola])

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
          const date = new Date(day.dateString)
          const now = new Date()

          //set hours and minutes of date to now
          date.setHours(now.getHours())
          date.setMinutes(now.getMinutes())

          setSelectedDay(date.toISOString())

          setBottomSheetStatus(CalendarBottomSheetStatus.DAILY_EVENTS)
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
            month={lan === "it" ? monthsIt[month] : monthsEn[month]}
            year={year}
            onSwitchChange={(value: boolean, title: string) =>
              calendarObj.current?.updatePeriods(title, value)
            }
          />
        )}
        {bottomSheetStatus === CalendarBottomSheetStatus.MONTHLY_EVENTS && (
          <CalendarMonthlyEvents
            events={calendarEventsMonth}
            month={lan === "it" ? monthsIt[month] : monthsEn[month]}
            year={year}
            lan={lan}
            onDeleteEvent={(id: string) => {
              calendarObj.current?.removeEvent(id)
            }}
            onSelectedEvent={(event: CalendarEvent) => {
              setSelectedEvent(event)
              setBottomSheetStatus(CalendarBottomSheetStatus.EVENT_DETAILS)
            }}
          />
        )}
        {bottomSheetStatus === CalendarBottomSheetStatus.ADD_EVENT && (
          <CalendarAddEvent
            addEvent={(event: CalendarEvent) => {
              calendarObj.current?.addEvent(event)
              setBottomSheetStatus(CalendarBottomSheetStatus.MONTHLY_EVENTS)
            }}
            date={selectedDay}
          />
        )}
        {bottomSheetStatus == CalendarBottomSheetStatus.DAILY_EVENTS && (
          <CalendarDailyEvents
            events={calendarEventsDaily}
            month={lan === "it" ? monthsIt[month] : monthsEn[month]}
            year={year}
            lan={lan}
            day={new Date(selectedDay).getDate()}
            onChangeStatusEvent={(id: string, status: CalendarEventStatus) => {
              calendarObj.current?.changeEventStatus(id, status)
            }}
            goToAddEvent={() => {
              setBottomSheetStatus(CalendarBottomSheetStatus.ADD_EVENT)
            }}
          />
        )}
        {bottomSheetStatus == CalendarBottomSheetStatus.EVENT_DETAILS && (
          <CalendarEventDetails
            event={selectedEvent}
            updateNotes={(id: string, notes: string) => {
              calendarObj.current?.updateNotes(id, notes)
            }}
          />
        )}
      </BoxShadowView>
      <NavBar
        overrideBackBehavior={() => {
          if (bottomSheetStatus === CalendarBottomSheetStatus.EVENT_DETAILS) {
            setBottomSheetStatus(CalendarBottomSheetStatus.MONTHLY_EVENTS)
          } else if (
            bottomSheetStatus === CalendarBottomSheetStatus.MONTHLY_EVENTS
          ) {
            setBottomSheetStatus(CalendarBottomSheetStatus.PERIODS)
          } else if (
            bottomSheetStatus === CalendarBottomSheetStatus.ADD_EVENT
          ) {
            setBottomSheetStatus(CalendarBottomSheetStatus.DAILY_EVENTS)
          } else if (
            bottomSheetStatus === CalendarBottomSheetStatus.DAILY_EVENTS
          ) {
            setBottomSheetStatus(CalendarBottomSheetStatus.MONTHLY_EVENTS)
          } else {
            navigation.goBack()
          }
        }}
      />
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
