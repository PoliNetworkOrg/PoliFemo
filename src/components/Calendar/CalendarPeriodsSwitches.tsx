import { FC } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { CalendarPeriod } from "utils/calendar"
import { ToggleSwitch } from "components/ToggleSwitch"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"

interface CalendarPeriodsSwitchesProps {
  calendarPeriods?: CalendarPeriod[]
  month: string
  year: number
  onSwitchChange: (value: boolean, title: string) => void
}

export const CalendarPeriodsSwitches: FC<
  CalendarPeriodsSwitchesProps
> = props => {
  const { calendarPeriods, month, year } = props

  const { homeBackground } = usePalette()

  if (!calendarPeriods) return null

  return (
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
        {month + " " + year}
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
              <Text style={[styles.periodTitle, { color: homeBackground }]}>
                {period.title}
              </Text>
              <Text style={[styles.periodSubTitle, { color: homeBackground }]}>
                {period.subtitle}
              </Text>
            </View>
            <ToggleSwitch
              color={period.color}
              value={period.shown}
              onValueChange={value => props.onSwitchChange(value, period.title)}
            />
          </View>
        )
      })}
    </ScrollView>
  )
}

//stylesheet
const styles = StyleSheet.create({
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
