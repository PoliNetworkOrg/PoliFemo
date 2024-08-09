import { FC, useCallback } from "react"
import { View, ViewStyle } from "react-native"
import { Calendar } from "react-native-calendars"
import { useCurrentLanguage } from "utils/language"
import { monthsIt, monthsEn, daysOfWeekLetters } from "utils/calendar"
import { formatDateOnlyString } from "utils/functions"
import { usePalette } from "utils/colors"
import { Text } from "components/Text"
import { DateData, MarkedDates } from "react-native-calendars/src/types"
import { DayComponentCustom } from "./DayComponentCustom"
import { DayProps } from "react-native-calendars/src/calendar/day"

const DAY_HEIGHT = 22

interface SingleMonthProps {
  month: number
  year: number
  markedDates: MarkedDates
  style?: ViewStyle
}

export const SingleMonth: FC<SingleMonthProps> = props => {
  const { palette } = usePalette()

  const lan = useCurrentLanguage()

  const DCC = useCallback<
    (props: DayProps & { date?: DateData }) => JSX.Element
  >(props => <DayComponentCustom {...props} />, [])

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
      }}
    >
      <View style={{ marginHorizontal: 12, marginTop: 6 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "900",
            color: palette.primary,
            paddingBottom: 4,
          }}
        >
          {lan === "it" ? monthsIt[props.month] : monthsEn[props.month]}{" "}
          {props.year}
        </Text>
        <View
          style={{
            height: 18,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {daysOfWeekLetters.map((day, index) => (
            <Text
              key={index}
              style={{
                fontSize: 10,
                fontWeight: "900",
                color: palette.primary,
              }}
            >
              {day}
            </Text>
          ))}
        </View>
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: palette.primary,
          }}
        />
      </View>
      <Calendar
        style={{ minHeight: DAY_HEIGHT * 7 }}
        firstDay={1}
        theme={{
          calendarBackground: "transparent",
          selectedDayTextColor: "orange",
          todayTextColor: "yellow",
          dayTextColor: "#fff",
          weekVerticalMargin: 2,
        }}
        initialDate={formatDateOnlyString(new Date(props.year, props.month, 2))}
        disableMonthChange={true}
        customHeaderTitle={undefined}
        hideExtraDays={true}
        renderHeader={() => null}
        renderArrow={() => null}
        enableSwipeMonths={false}
        showSixWeeks={true}
        hideDayNames={true}
        headerStyle={{ display: "none" }}
        markingType="period"
        markedDates={props.markedDates}
        dayComponent={DCC}
      />
    </View>
  )
}
