import { FC } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { CalendarEvent } from "utils/calendar"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { CalendarButton } from "./Button"

interface CalendarAddEventProps {
  addEvent: (event: CalendarEvent) => void
  date: string
}

export const CalendarAddEvent: FC<CalendarAddEventProps> = props => {
  const { homeBackground, dotColor } = usePalette()

  const dateObj = new Date(props.date)

  // ! WIP
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 24,
      }}
      style={{ marginBottom: 90 }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={[styles.title, { color: homeBackground, paddingBottom: 16 }]}
        >
          Nuovo Evento
        </Text>
        <View style={{ flexDirection: "row" }}>
          <CalendarButton>
            <Text style={{ fontSize: 14, fontWeight: "700" }}>Ok</Text>
          </CalendarButton>
          <CalendarButton style={{ width: 80, marginLeft: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: "700" }}>Annulla</Text>
          </CalendarButton>
        </View>
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: "900",
  },
})
