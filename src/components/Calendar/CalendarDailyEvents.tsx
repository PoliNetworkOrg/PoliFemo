import { FC } from "react"
import { View, ScrollView, StyleSheet, Pressable } from "react-native"
import {
  CalendarEventStatus,
  formatHoursFromDate,
  getBackColorFromEventStatus,
  getSourceEmoticon,
  getTextFromEventStatus,
  monthsEn,
  monthsIt,
} from "utils/calendar"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { Icon } from "components/Icon"

import tickSvg from "assets/freeClassrooms/tick.svg"
import { DottedLine } from "./DottedLine"
import { CalendarButton } from "./Button"
import { useTranslation } from "react-i18next"
import { Event } from "api/collections/event"

interface CalendarDailyEventsProps {
  events: Event[]

  dayString: string
  onChangeStatusEvent: (id: string, status: CalendarEventStatus) => void
  goToAddEvent: () => void
}

export const CalendarDailyEvents: FC<CalendarDailyEventsProps> = props => {
  const { events, dayString } = props
  const { t, i18n } = useTranslation("calendar")

  const date = new Date(dayString)

  const day = date.getDate()

  const monthNumber = date.getMonth()

  const month =
    i18n.language == "it" ? monthsIt[monthNumber] : monthsEn[monthNumber]

  const year = date.getFullYear()

  const { isLight, homeBackground, palette } = usePalette()

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 24,
      }}
      style={{ marginBottom: 90 }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text
          style={[
            styles.monthTitle,
            {
              color: isLight ? homeBackground : "#fff",
              paddingBottom: 16,
              marginLeft: 8,
            },
          ]}
        >
          {day + " " + month + " " + year}
        </Text>
        <CalendarButton
          onPress={() => props?.goToAddEvent()}
          style={{ width: 100, height: 32 }}
        >
          <Text>{t("add")}</Text>
        </CalendarButton>
      </View>

      {events.map((event, index) => {
        return (
          <Pressable
            key={event.event_id}
            onPress={() => {
              // props.onChangeStatusEvent(
              //   event.event_id,
              //   shiftedEventStatus(event.status)
              // )
            }}
          >
            <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
              <View
                style={{
                  height: 60,
                  width: "100%",
                  flexDirection: "row",
                  paddingRight: 8,
                }}
              >
                <View
                  style={{
                    marginHorizontal: 8,
                    marginTop: 12,
                  }}
                >
                  <Icon scale={0.8} source={getSourceEmoticon("boom")} />
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      width: 120,
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.mediumSizeText,
                        { color: isLight ? homeBackground : "#fff" },
                      ]}
                    >
                      {i18n.language === "it" ? event.title.it : event.title.en}
                    </Text>
                    <Text
                      style={[
                        styles.smallSizeText,
                        { color: isLight ? homeBackground : "#fff" },
                      ]}
                    >
                      {formatHoursFromDate(event.date_start)}
                      {event.room?.acronym_dn
                        ? ` | ${event.room?.acronym_dn}`
                        : ""}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 120,
                      height: 28,
                      marginLeft: 10,
                      borderRadius: 6,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      backgroundColor: getBackColorFromEventStatus(
                        CalendarEventStatus.INITIAL,
                        isLight
                      ),
                    }}
                  >
                    <Text
                      style={[
                        styles.mediumSizeText,
                        { color: isLight ? "#fff" : palette.darker },
                      ]}
                    >
                      {getTextFromEventStatus(
                        CalendarEventStatus.INITIAL,
                        i18n.language
                      )}
                    </Text>
                  </View>

                  {event == event ? (
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: isLight ? "#F2F2F2" : "#D7D9E2",
                      }}
                    />
                  ) : event == event ? (
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 4,
                        borderColor: "#F29999",
                      }}
                    />
                  ) : (
                    <View style={{ height: 40, width: 40 }}>
                      <Icon
                        source={tickSvg}
                        color={isLight ? palette.primary : "#9BC0D8"}
                        scale={2.6}
                      />
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  marginRight: 8,
                }}
              >
                {index != events.length - 1 ? (
                  <DottedLine />
                ) : (
                  <View style={{ height: 16 }} />
                )}
              </View>
            </View>
          </Pressable>
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
