import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
/* import { useTranslation } from "react-i18next" */
import { BoxShadowView } from "components/BoxShadow"
import { NavBar } from "components/NavBar"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { StyleSheet } from "react-native"
import { CalendarList } from "react-native-calendars"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
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
import { SingleMonth } from "components/Calendar/SingleMonth"
import { ScrollView } from "react-native-gesture-handler"

export const CalendarPage: MainStackScreen<"Calendar"> = () => {
  const { homeBackground, background, dotColor, isLight, palette } =
    usePalette()

  // todo : implement translation :(
  /* const { t } = useTranslation() */

  const { userInfo } = useContext(LoginContext)

  const { matricola } = userInfo?.careers?.[0] ?? {}

  const lan = useCurrentLanguage()

  const today = new Date()

  const [selectedDay, setSelectedDay] = useState(new Date().toISOString())

  const [visibleDay, setVisibleDay] = useState(new Date().toISOString())

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

  const calendarObj = useRef<CalendarManager | undefined>()

  const calendarMemoized = useMemo<JSX.Element>(() => {
    return (
      <CalendarList
        firstDay={1}
        pagingEnabled={true}
        staticHeader={true}
        scrollEnabled={true}
        scrollsToTop={false}
        initialNumToRender={10}
        pastScrollRange={12}
        futureScrollRange={12}
        horizontal={true}
        theme={{
          calendarBackground: isLight ? palette.primary : palette.darker,
          selectedDayTextColor: "orange",
          todayTextColor: "yellow",
          dayTextColor: "#fff",
          dotStyle: { width: 6, height: 6, borderRadius: 3 },
          dotColor: dotColor,
          stylesheet: {
            day: {
              period: { isLight: isLight },
            },
          },
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
          marginTop: 176,
          height: 270,
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
        showSixWeeks={true}
        hideDayNames={true}
        markingType="period"
        current={visibleDay}
        onMonthChange={date => {
          setMonth(date.month - 1)
          setYear(date.year)
        }}
        dayComponent={dayComponentCustom}
      />
    )
  }, [markedDates, visibleDay, isLight])

  // I thought memoizing would improve performance, but it appears to be still very slow!!
  const scrollMonths = useMemo<JSX.Element>(() => {
    return (
      <View style={{ marginTop: 150, overflow: "hidden" }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
          {[
            [-1, 0],
            [1, 2],
            [3, 4],
          ].map(monthOffsets => {
            const todayYear = today.getFullYear()
            const todayMonth = today.getMonth()

            const monthOffset1 = monthOffsets[0]

            const monthOffset2 = monthOffsets[1]

            let newYear1
            let newMonth1 = todayMonth + monthOffset1

            if (newMonth1 === -1) {
              newMonth1 = 11
              newYear1 = todayYear - 1
            } else if (newMonth1 === 12) {
              newMonth1 = 0
              newYear1 = todayYear + 1
            } else {
              newYear1 = todayYear
            }

            const nMonthsAgoOrFutureDate1 = new Date(newYear1, newMonth1, 1)

            let newYear2
            let newMonth2 = todayMonth + monthOffset2

            if (newMonth2 === -1) {
              newMonth2 = 11
              newYear2 = todayYear - 1
            } else if (newMonth2 === 12) {
              newMonth2 = 0
              newYear2 = todayYear + 1
            } else {
              newYear2 = todayYear
            }

            const nMonthsAgoOrFutureDate2 = new Date(newYear2, newMonth2, 1)

            return (
              <View
                key={monthOffset1}
                style={{
                  flexDirection: "row",
                  marginTop: 16,
                  marginHorizontal: 32,
                }}
              >
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => {
                    setMonth(nMonthsAgoOrFutureDate1.getMonth())
                    setVisibleDay(
                      nMonthsAgoOrFutureDate1.toISOString().slice(0, 10)
                    )
                    setBottomSheetStatus(
                      CalendarBottomSheetStatus.MONTHLY_EVENTS
                    )
                  }}
                >
                  <SingleMonth
                    markedDates={markedDates}
                    month={nMonthsAgoOrFutureDate1.getMonth()}
                    year={nMonthsAgoOrFutureDate1.getFullYear()}
                  />
                </Pressable>
                <View style={{ width: 16 }} />
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => {
                    setMonth(nMonthsAgoOrFutureDate2.getMonth())
                    setVisibleDay(
                      nMonthsAgoOrFutureDate2.toISOString().slice(0, 10)
                    )
                    setBottomSheetStatus(
                      CalendarBottomSheetStatus.MONTHLY_EVENTS
                    )
                  }}
                >
                  <SingleMonth
                    markedDates={markedDates}
                    month={nMonthsAgoOrFutureDate2.getMonth()}
                    year={nMonthsAgoOrFutureDate2.getFullYear()}
                  />
                </Pressable>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }, [markedDates])

  useEffect(() => {
    const initCalendar = () => {
      if (!calendarObj.current) {
        calendarObj.current = new CalendarManager({
          hidePeriods: false,
          matricola: matricola,
        })
        calendarObj.current.addListener("markedDatesSet", () => {
          if (calendarObj.current?.datesMarkedAndPeriods) {
            console.log("marked dates sets")
            setMarkedDates(calendarObj.current?.datesMarkedAndPeriods)
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
        if (calendarObj.current?.datesMarkedAndPeriods) {
          setMarkedDates(calendarObj.current?.datesMarkedAndPeriods)
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
    if (
      bottomSheetStatus !== CalendarBottomSheetStatus.PERIODS &&
      bottomSheetStatus !== CalendarBottomSheetStatus.ALL_MONTHS
    ) {
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
            onPress={() =>
              bottomSheetStatus === CalendarBottomSheetStatus.ALL_MONTHS
                ? setBottomSheetStatus(CalendarBottomSheetStatus.PERIODS)
                : setBottomSheetStatus(CalendarBottomSheetStatus.ALL_MONTHS)
            }
          >
            <Icon source={calendarIcon} />
          </Pressable>

          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPress={() => {
                if (
                  bottomSheetStatus !== CalendarBottomSheetStatus.MONTHLY_EVENTS
                ) {
                  setBottomSheetStatus(CalendarBottomSheetStatus.MONTHLY_EVENTS)
                } else {
                  setBottomSheetStatus(CalendarBottomSheetStatus.PERIODS)
                }
              }}
            >
              <Icon source={userIcon} style={{ marginRight: 8 }} />
            </Pressable>
            <Pressable
              onPress={() => {
                if (bottomSheetStatus !== CalendarBottomSheetStatus.PERIODS) {
                  setBottomSheetStatus(CalendarBottomSheetStatus.PERIODS)
                }
              }}
            >
              <Icon source={capeIcon} />
            </Pressable>
          </View>
        </View>
        {bottomSheetStatus != CalendarBottomSheetStatus.ALL_MONTHS && (
          <>
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
            <View
              style={{ width: "100%", height: 1, backgroundColor: "#fff" }}
            />
          </>
        )}
      </View>
      {bottomSheetStatus != CalendarBottomSheetStatus.ALL_MONTHS && (
        <>
          {calendarMemoized}
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
                lan={lan}
                dayString={selectedDay}
                onChangeStatusEvent={(
                  id: string,
                  status: CalendarEventStatus
                ) => {
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
        </>
      )}

      {bottomSheetStatus == CalendarBottomSheetStatus.ALL_MONTHS && (
        <View style={{ marginTop: 0, overflow: "hidden" }}>{scrollMonths}</View>
      )}

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
          } else if (
            bottomSheetStatus === CalendarBottomSheetStatus.ALL_MONTHS
          ) {
            setBottomSheetStatus(CalendarBottomSheetStatus.PERIODS)
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
