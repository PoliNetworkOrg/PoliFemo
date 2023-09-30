import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Calendar } from "react-native-calendars"
import { useCurrentLanguage } from "utils/articles"
import {
  monthsIt,
  monthsEn,
  daysOfWeekLetters,
  dayComponentAllMonthPage,
} from "utils/calendar"
import { usePalette } from "utils/colors"
import { Text } from "components/Text"
import { MarkedDates } from "react-native-calendars/src/types"

interface SingleMonthProps {
  month: number
  year: number
  markedDates: MarkedDates
  style?: ViewStyle
}

export const SingleMonth: FC<SingleMonthProps> = props => {
  const { palette } = usePalette()

  const lan = useCurrentLanguage()

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        height: 204,
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
        theme={{
          calendarBackground: "transparent",
          selectedDayTextColor: "orange",
          todayTextColor: "yellow",
          dayTextColor: "#fff",
          weekVerticalMargin: 2,
        }}
        initialDate={new Date(props.year, props.month, 1)
          .toISOString()
          .slice(0, 10)}
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
        dayComponent={dayComponentAllMonthPage}
      />
    </View>
  )
}
