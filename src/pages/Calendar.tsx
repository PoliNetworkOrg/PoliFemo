import { MainStackScreen } from "navigation/NavigationTypes"
/* import { useTranslation } from "react-i18next" */
import { NavBar } from "components/NavBar"
import { Pressable, View } from "react-native"
import { palette, usePalette } from "utils/colors"
import { StyleSheet } from "react-native"
import { CalendarList } from "react-native-calendars"
import { useContext, useMemo, useState } from "react"
import {
  daysOfWeekLetters,
  addMarkForEvents,
  addMarkForPeriods,
  addMarkForSelectedDate,
} from "utils/calendar"
import { formatDateOnlyString } from "utils/functions"
import { DayComponentCustom } from "components/Calendar/DayComponentCustom"
import { DateData, MarkedDates } from "react-native-calendars/src/types"
import { Text } from "components/Text"
import { Icon } from "components/Icon"
import calendarIcon from "assets/calendar/calendar.svg"
import capeIcon from "assets/calendar/cape_calendar.svg"
import userIcon from "assets/calendar/user_calendar.svg"
import { LoginContext } from "contexts/login"
import { useApiCall } from "api/useApiCall"
import { api } from "api"
import { CalendarBottomSheet } from "components/Calendar/CalendarBottomSheet"

export const CalendarPage: MainStackScreen<"Calendar"> = () => {
  const { homeBackground, isLight } = usePalette()

  const { userInfo } = useContext(LoginContext)
  const { matricola } = userInfo?.careers?.[0] ?? {}

  const [monthDateData, setMonthDateData] = useState<DateData>({
    day: new Date().getDate(),
    timestamp: Date.now(),
    dateString: formatDateOnlyString(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })
  const [selectedDay, setSelectedDay] = useState<string>(formatDateOnlyString())

  const [events] = useApiCall(
    api.events.getEvents,
    {
      matricola: matricola ?? "",
      startDate: formatDateOnlyString(new Date(monthDateData.timestamp)),
      nEvents: 1000,
    },
    [matricola],
    {},
    matricola === undefined
  )

  const markedDates = useMemo<MarkedDates>(() => {
    let markedDates = {}
    markedDates = addMarkForSelectedDate(markedDates, selectedDay)
    markedDates = addMarkForEvents(markedDates, events)
    markedDates = addMarkForPeriods(markedDates, [])
    return markedDates
  }, [selectedDay, events])

  // I thought memoizing would improve performance, but it appears to be still very slow!!
  // const scrollMonths = useMemo<JSX.Element>(() => {
  //   return (
  //     <View style={{ marginTop: 150, overflow: "hidden" }}>
  //       <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
  //         {[
  //           [-1, 0],
  //           [1, 2],
  //           [3, 4],
  //         ].map(monthOffsets => {
  //           const todayYear = today.getFullYear()
  //           const todayMonth = today.getMonth()

  //           const monthOffset1 = monthOffsets[0]

  //           const monthOffset2 = monthOffsets[1]

  //           let newYear1
  //           let newMonth1 = todayMonth + monthOffset1

  //           if (newMonth1 === -1) {
  //             newMonth1 = 11
  //             newYear1 = todayYear - 1
  //           } else if (newMonth1 === 12) {
  //             newMonth1 = 0
  //             newYear1 = todayYear + 1
  //           } else {
  //             newYear1 = todayYear
  //           }

  //           const nMonthsAgoOrFutureDate1 = new Date(newYear1, newMonth1, 1)

  //           let newYear2
  //           let newMonth2 = todayMonth + monthOffset2

  //           if (newMonth2 === -1) {
  //             newMonth2 = 11
  //             newYear2 = todayYear - 1
  //           } else if (newMonth2 === 12) {
  //             newMonth2 = 0
  //             newYear2 = todayYear + 1
  //           } else {
  //             newYear2 = todayYear
  //           }

  //           const nMonthsAgoOrFutureDate2 = new Date(newYear2, newMonth2, 1)

  //           return (
  //             <View
  //               key={monthOffset1}
  //               style={{
  //                 flexDirection: "row",
  //                 marginTop: 16,
  //                 marginHorizontal: 32,
  //               }}
  //             >
  //               <Pressable
  //                 style={{ flex: 1 }}
  //                 onPress={() => {
  //                   setMonth(nMonthsAgoOrFutureDate1.getMonth())
  //                   setVisibleDay(
  //                     nMonthsAgoOrFutureDate1.toISOString().slice(0, 10)
  //                   )
  //                   setBottomSheetStatus(
  //                     CalendarBottomSheetStatus.MONTHLY_EVENTS
  //                   )
  //                 }}
  //               >
  //                 <SingleMonth
  //                   markedDates={_markedDates}
  //                   month={nMonthsAgoOrFutureDate1.getMonth()}
  //                   year={nMonthsAgoOrFutureDate1.getFullYear()}
  //                 />
  //               </Pressable>
  //               <View style={{ width: 16 }} />
  //               <Pressable
  //                 style={{ flex: 1 }}
  //                 onPress={() => {
  //                   setMonth(nMonthsAgoOrFutureDate2.getMonth())
  //                   setVisibleDay(
  //                     nMonthsAgoOrFutureDate2.toISOString().slice(0, 10)
  //                   )
  //                   setBottomSheetStatus(
  //                     CalendarBottomSheetStatus.MONTHLY_EVENTS
  //                   )
  //                 }}
  //               >
  //                 <SingleMonth
  //                   markedDates={_markedDates}
  //                   month={nMonthsAgoOrFutureDate2.getMonth()}
  //                   year={nMonthsAgoOrFutureDate2.getFullYear()}
  //                 />
  //               </Pressable>
  //             </View>
  //           )
  //         })}
  //       </ScrollView>
  //     </View>
  //   )
  // }, [_markedDates])

  // useEffect(() => {
  //   const initCalendar = () => {
  //     if (!calendarObj.current) {
  //       calendarObj.current = new CalendarManager({
  //         hidePeriods: false,
  //         matricola: matricola,
  //       })
  //       calendarObj.current.addListener("markedDatesSet", () => {
  //         if (calendarObj.current?.datesMarkedAndPeriods) {
  //           console.log("marked dates sets")
  //           setMarkedDates(calendarObj.current?.datesMarkedAndPeriods)
  //           setCalendarPeriods(calendarObj.current?.calendarPeriods)
  //         }
  //       })

  //       calendarObj.current.addListener("calendarPeriodsChanged", () => {
  //         if (calendarObj.current?.calendarPeriods) {
  //           console.log("calendarPeriodsChanged")
  //           setCalendarPeriods(calendarObj.current?.calendarPeriods)
  //         }
  //       })

  //       calendarObj.current.addListener("calendarEventsChanged", () => {
  //         if (calendarObj.current?.calendarEvents) {
  //           console.log("calendarEventsChanged")
  //           setCalendarEvents([...(calendarObj.current?.calendarEvents ?? [])])
  //         }
  //       })
  //     } else {
  //       if (calendarObj.current?.datesMarkedAndPeriods) {
  //         setMarkedDates(calendarObj.current?.datesMarkedAndPeriods)
  //         setCalendarPeriods(calendarObj.current?.calendarPeriods)
  //       }
  //     }
  //   }

  //   initCalendar()

  //   return () => {
  //     calendarObj?.current?.removeAllListeners("markedDatesSet")
  //     calendarObj?.current?.removeAllListeners("calendarPeriodsChanged")
  //     calendarObj?.current?.removeAllListeners("calendarEventsChanged")
  //   }
  // }, [])

  // useEffect(() => {
  //   if (calendarEvents.length > 0) {
  //     const filteredEvents = calendarEvents.filter(
  //       event =>
  //         new Date(event.start).getMonth() === month &&
  //         new Date(event.start).getFullYear() === year
  //     )

  //     setCalendarEventsMonth(filteredEvents)
  //   }
  // }, [calendarEvents, month, year])

  // useEffect(() => {
  //   if (calendarEvents.length > 0) {
  //     const filteredEvents = calendarEvents.filter(
  //       event =>
  //         new Date(event.start).getDate() === new Date(selectedDay).getDate() &&
  //         new Date(event.start).getMonth() === month &&
  //         new Date(event.start).getFullYear() === year
  //     )

  //     setCalendarEventsDaily(filteredEvents)
  //   }
  // }, [calendarEvents, selectedDay])

  // hide or show peridos based on bottom sheet status
  // useEffect(() => {
  //   if (
  //     bottomSheetStatus !== CalendarBottomSheetStatus.PERIODS &&
  //     bottomSheetStatus !== CalendarBottomSheetStatus.ALL_MONTHS
  //   ) {
  //     if (calendarObj.current?.hidePeriods == false) {
  //       calendarObj.current?.hideAllPerdiods()
  //     }
  //   } else if (bottomSheetStatus === CalendarBottomSheetStatus.PERIODS) {
  //     calendarObj.current?.showSwitchedOnPeriods()
  //   }
  // }, [bottomSheetStatus])

  // change matricola
  // useEffect(() => {
  //   if (
  //     calendarObj.current &&
  //     matricola &&
  //     calendarObj.current.matricola !== matricola
  //   ) {
  //     calendarObj.current?.changeMatricola(matricola)
  //   }
  // }, [matricola])

  return (
    <View style={[{ backgroundColor: homeBackground }, styles.container]}>
      <View
        style={{
          position: "absolute",
          top: 120,
          height: 40,
          width: "100%",
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
          // onPress={() =>
          //   bottomSheetStatus === CalendarBottomSheetStatus.ALL_MONTHS
          //     ? setBottomSheetStatus(CalendarBottomSheetStatus.PERIODS)
          //     : setBottomSheetStatus(CalendarBottomSheetStatus.ALL_MONTHS)
          // }
          >
            <Icon source={calendarIcon} />
          </Pressable>

          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPress={() => {
                // if (
                //   bottomSheetStatus !== CalendarBottomSheetStatus.MONTHLY_EVENTS
                // ) {
                //   setBottomSheetStatus(CalendarBottomSheetStatus.MONTHLY_EVENTS)
                // } else {
                //   setBottomSheetStatus(CalendarBottomSheetStatus.PERIODS)
                // }
              }}
            >
              <Icon source={userIcon} style={{ marginRight: 8 }} />
            </Pressable>
            <Pressable
              onPress={() => {
                // if (bottomSheetStatus !== CalendarBottomSheetStatus.PERIODS) {
                //   setBottomSheetStatus(CalendarBottomSheetStatus.PERIODS)
                // }
              }}
            >
              <Icon source={capeIcon} />
            </Pressable>
          </View>
        </View>

        <View
          style={{
            height: 24,
            width: "100%",
            paddingHorizontal: 8,
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
      <CalendarList
        firstDay={1}
        pagingEnabled={true}
        staticHeader={true}
        scrollEnabled={true}
        scrollsToTop={false}
        pastScrollRange={12}
        futureScrollRange={12}
        horizontal={true}
        theme={{
          calendarBackground: "transparent",
          selectedDayTextColor: "orange",
          todayTextColor: "yellow",
          dayTextColor: "#fff",
          dotStyle: { width: 6, height: 6, borderRadius: 3 },
          dotColor: palette.accent,
          stylesheet: {
            day: {
              period: { isLight: isLight },
            },
          },
        }}
        onDayPress={day => setSelectedDay(day.dateString)}
        style={{
          marginTop: 176,
          height: 270,
          backgroundColor: "transparent",
        }}
        markedDates={markedDates}
        renderArrow={() => null}
        renderHeader={() => null}
        hideExtraDays={true}
        showSixWeeks={true}
        hideDayNames={true}
        markingType="period"
        onMonthChange={date => setMonthDateData(date)}
        dayComponent={DayComponentCustom}
      />

      <CalendarBottomSheet
        events={events}
        currentMonthDateData={monthDateData}
      />

      <NavBar
      // overrideBackBehavior={() => {
      //   if (bottomSheetStatus === CalendarBottomSheetStatus.EVENT_DETAILS) {
      //     setBottomSheetStatus(CalendarBottomSheetStatus.MONTHLY_EVENTS)
      //   } else if (
      //     bottomSheetStatus === CalendarBottomSheetStatus.MONTHLY_EVENTS
      //   ) {
      //     setBottomSheetStatus(CalendarBottomSheetStatus.PERIODS)
      //   } else if (
      //     bottomSheetStatus === CalendarBottomSheetStatus.ADD_EVENT
      //   ) {
      //     setBottomSheetStatus(CalendarBottomSheetStatus.DAILY_EVENTS)
      //   } else if (
      //     bottomSheetStatus === CalendarBottomSheetStatus.DAILY_EVENTS
      //   ) {
      //     setBottomSheetStatus(CalendarBottomSheetStatus.MONTHLY_EVENTS)
      //   } else if (
      //     bottomSheetStatus === CalendarBottomSheetStatus.ALL_MONTHS
      //   ) {
      //     setBottomSheetStatus(CalendarBottomSheetStatus.PERIODS)
      //   } else {
      //     navigation.goBack()
      //   }
      // }}
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
