import { FC } from "react"
import { View, ScrollView, StyleSheet, Pressable } from "react-native"
import {
  CalendarEvent,
  formatCalendarEventDay,
  getSourceEmoticon,
} from "utils/calendar"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { Icon } from "components/Icon"
import { Divider } from "components/Divider"
import deleteSvg from "assets/modal/delete.svg"

interface CalendarMonthlyEventsProps {
  events: CalendarEvent[]
  month: string
  year: number
  lan: string
  onDeleteEvent: (id: string) => void
}

export const CalendarMonthlyEvents: FC<CalendarMonthlyEventsProps> = props => {
  const { events, month, year, lan } = props

  const { homeBackground, dotColor } = usePalette()

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

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 36 }}
      >
        {events.length > 0 && (
          <View
            style={{
              width: 14,
              height: 14,
              backgroundColor: dotColor,
              borderRadius: 7,
              marginRight: 10,
            }}
          />
        )}
        <Text style={[styles.mediumSizeText, { color: homeBackground }]}>
          {events.length > 0
            ? events.length + " eventi in programma"
            : "Nessun evento in programma"}
        </Text>
      </View>
      {events.map(event => {
        return (
          <View
            key={event.id}
            style={{
              height: 80,
              width: "100%",
              backgroundColor: "rgba(242, 242, 242, 0.4",
              borderColor: "rgba(69, 71, 115, 1)",
              borderWidth: 0.5,
              borderRadius: 5,
              flexDirection: "row",
              marginBottom: 12,
              paddingRight: 16,
            }}
          >
            <View style={{ marginHorizontal: 12, marginTop: 12 }}>
              <Icon source={getSourceEmoticon(event.mood)} />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={[styles.mediumSizeText, { color: homeBackground }]}
                >
                  {event.title}
                </Text>
                <Pressable onPress={() => props.onDeleteEvent(event.id)}>
                  <Icon source={deleteSvg} scale={0.8} />
                </Pressable>
              </View>

              <Text
                style={[
                  styles.smallSizeText,
                  { color: homeBackground, paddingBottom: 4 },
                ]}
              >
                {formatCalendarEventDay(event, lan)}
              </Text>
              <Divider />
              <Text
                style={[
                  styles.smallSizeText,
                  { color: homeBackground, paddingTop: 4 },
                ]}
              >
                Note
              </Text>
            </View>
          </View>
        )
      })}
    </ScrollView>
  )
}

//stylesheet
const styles = StyleSheet.create({
  mediumSizeText: {
    fontSize: 16,
    fontWeight: "700",
  },
  smallSizeText: { fontSize: 12, fontWeight: "400" },
  monthTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
})
