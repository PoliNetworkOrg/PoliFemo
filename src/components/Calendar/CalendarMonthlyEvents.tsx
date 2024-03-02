import { FC } from "react"
import { View, StyleSheet, Pressable } from "react-native"
import { formatCalendarEventDay, getSourceEmoticon } from "utils/calendar"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { Icon } from "components/Icon"
import { Divider } from "components/Divider"
import { useTranslation } from "react-i18next"
import { Event } from "api/collections/event"

interface CalendarMonthlyEventsProps {
  events: Event[]
  month: string
  year: number
  lan: string
}

export const CalendarMonthlyEvents: FC<CalendarMonthlyEventsProps> = props => {
  const { events, month, year, lan } = props

  const { homeBackground, dotColor, isLight } = usePalette()

  const { t } = useTranslation("calendar")

  return (
    <View style={{ marginBottom: 90 }}>
      <Text
        style={[
          styles.monthTitle,
          { color: isLight ? homeBackground : "#fff", paddingBottom: 16 },
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
        <Text
          style={[
            styles.mediumSizeText,
            { color: isLight ? homeBackground : "#fff" },
          ]}
        >
          {events.length > 0
            ? events.length + t("scheduledEvents")
            : t("noScheduledEvents")}
        </Text>
      </View>
      {events.map(event => {
        return (
          <Pressable
            key={event.event_id}
            onPress={() => {
              // TODO: on press
            }}
          >
            <View
              style={{
                height: 80,
                width: "100%",
                backgroundColor: isLight
                  ? "rgba(242, 242, 242, 0.4"
                  : "#343A55",
                borderColor: "rgba(69, 71, 115, 1)",
                borderWidth: 0.5,
                borderRadius: 5,
                flexDirection: "row",
                marginBottom: 12,
                paddingRight: 16,
              }}
            >
              <View style={{ marginHorizontal: 12, marginTop: 12 }}>
                <Icon source={getSourceEmoticon("broken_heart")} />
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
                    style={[
                      styles.mediumSizeText,
                      {
                        color: isLight ? homeBackground : "#fff",
                        marginRight: 2,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {lan === "it" ? event.title.it : event.title.en}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.smallSizeText,
                    {
                      color: isLight ? homeBackground : "#fff",
                      paddingBottom: 4,
                    },
                  ]}
                >
                  {formatCalendarEventDay(event, lan)}
                </Text>
                <Divider color={isLight ? undefined : "#fff"} height={0.5} />
                <Text
                  style={[
                    styles.smallSizeText,
                    { color: isLight ? homeBackground : "#fff", paddingTop: 4 },
                  ]}
                  numberOfLines={1}
                >
                  {t("addNotes")}
                </Text>
              </View>
            </View>
          </Pressable>
        )
      })}
    </View>
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
