import { MainStackScreen } from "navigation/NavigationTypes"
import { useTranslation } from "react-i18next"
import { BoxShadowView } from "components/BoxShadow"
import { NavBar } from "components/NavBar"
import { ScrollView, View } from "react-native"
import { usePalette } from "utils/colors"
import { StyleSheet } from "react-native"
import { Calendar } from "react-native-calendars"
import { useEffect, useRef, useState } from "react"
import {
  CalendarPeriod,
  CalendarSingletonWrapper as CalendarManager,
  dayComponentCustom,
  dotColorGold,
  months,
  daysOfWeekLetters,
} from "utils/calendar"
import { MarkedDates } from "react-native-calendars/src/types"
import { Text } from "components/Text"
import { ToggleSwitch } from "components/ToggleSwitch"
import { Icon } from "components/Icon"
import calendarIcon from "assets/calendar/calendar.svg"
import capeIcon from "assets/calendar/cape_calendar.svg"
import userIcon from "assets/calendar/user_calendar.svg"

export const CalendarPage: MainStackScreen<"Calendar"> = () => {
  const { homeBackground, background, isLight, palette } = usePalette()
  const { t } = useTranslation()

  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().slice(0, 10)
  )

  const [month, setMonth] = useState<number>(new Date().getMonth())

  const [year, setYear] = useState<number>(new Date().getFullYear())

  const [markedDates, setMarkedDates] = useState<MarkedDates>({})

  const [calendarPeriods, setCalendarPeriods] = useState<
    CalendarPeriod[] | undefined
  >()

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
    }
  }, [])

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
          <Icon source={calendarIcon} />
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
          dotColor: dotColorGold,
        }}
        onDayPress={day => {
          console.log(day)
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
      {/* </View> */}
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
        {calendarPeriods && (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 24,
            }}
            style={{ marginBottom: 90 }}
          >
            <Text
              style={[
                styles.monthTitle,
                { color: homeBackground, paddingBottom: 16 },
              ]}
            >
              {months[month] + " " + year}
            </Text>
            {calendarPeriods.map(period => {
              return (
                <View
                  key={period.title}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: 32,
                  }}
                >
                  <View>
                    <Text
                      style={[styles.periodTitle, { color: homeBackground }]}
                    >
                      {period.title}
                    </Text>
                    <Text
                      style={[styles.periodSubTitle, { color: homeBackground }]}
                    >
                      {period.subtitle}
                    </Text>
                  </View>
                  <ToggleSwitch
                    color={period.color}
                    value={period.shown}
                    onValueChange={value =>
                      calendarObj.current?.updatePeriods(period.title, value)
                    }
                  />
                </View>
              )
            })}
            {/* <View style={{ height: 200, backgroundColor: "red", width: 20 }} /> */}
          </ScrollView>
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
  periodTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  periodSubTitle: {
    fontSize: 12,
    fontWeight: "400",
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
})
