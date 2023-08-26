import { FC, useEffect, useRef } from "react"
import { View, ScrollView, StyleSheet, TextInput, Keyboard } from "react-native"
import {
  CalendarEvent,
  emoticons,
  formatDateCalendarDetails,
  formatHoursFromDate,
} from "utils/calendar"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { Icon } from "components/Icon"
import { useTranslation } from "react-i18next"

interface CalendarEventDetailsProps {
  event?: CalendarEvent
  updateNotes: (id: string, notes: string) => void
}

export const CalendarEventDetails: FC<CalendarEventDetailsProps> = props => {
  const { event } = props

  const { homeBackground } = usePalette()

  //i18n
  const { t } = useTranslation("calendar")

  const inputText = useRef<TextInput>(null)

  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        inputText.current?.blur()
      }
    )

    return () => {
      keyboardDidHideListener.remove()
    }
  }, [])

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 24,
      }}
      style={{ marginBottom: 90 }}
    >
      <View style={{ flexDirection: "row" }}>
        {event?.mood && (
          <Icon
            source={emoticons[event.mood]}
            style={{ marginHorizontal: 1 }}
          />
        )}
        <Text
          style={[styles.text20w700, { color: homeBackground, marginLeft: 8 }]}
        >
          {event?.title}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={[styles.text16w700, { color: homeBackground }]}>
          {formatDateCalendarDetails(event)}
        </Text>
        <View
          style={{
            width: 2,
            backgroundColor: homeBackground,
            height: 30,
            marginHorizontal: 8,
          }}
        />
        <Text style={[styles.text16w700, { color: homeBackground }]}>
          {formatHoursFromDate(event?.start)}
        </Text>
        {event?.isPolimiEvent && event.polimiEventFields?.room?.acronym_dn ? (
          <>
            <View
              style={{
                width: 2,
                backgroundColor: homeBackground,
                height: 30,
                marginHorizontal: 8,
              }}
            />
            <Text style={[styles.text16w700, { color: homeBackground }]}>
              {event.polimiEventFields.room.acronym_dn}
            </Text>
          </>
        ) : (
          <View style={{ width: 100 }} />
        )}
      </View>
      {event?.reminder ??
        (true && (
          <View
            style={{
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.text16w700, { color: homeBackground }]}>
              {t("reminder")}
            </Text>
            <Text
              style={[
                styles.text16w700,
                {
                  color: homeBackground,
                },
              ]}
            >
              {formatHoursFromDate(new Date().toISOString())}
            </Text>
          </View>
        ))}

      <Text
        style={[styles.text16w700, { color: homeBackground, marginTop: 16 }]}
      >
        {t("notes")}
      </Text>

      <TextInput
        style={{
          marginTop: 8,
          fontWeight: "400",
          fontSize: 14,
          paddingBottom: 2,
          backgroundColor: "#f2f2f2",
          paddingHorizontal: 8,
          paddingVertical: 8,
          verticalAlign: "top",
          borderRadius: 12,
          color: homeBackground,
        }}
        onChangeText={text => {
          if (timer.current) {
            clearTimeout(timer.current)
          }
          timer.current = setTimeout(() => {
            props.updateNotes(event?.id ?? "", text)
          }, 1000)
        }}
        ref={inputText}
        defaultValue={event?.notes}
        multiline={true}
        maxLength={200}
        numberOfLines={4}
        placeholderTextColor={homeBackground}
        placeholder="aggiungi delle note"
      />
      {/* <View style={{ height: 110 }} /> */}
    </ScrollView>
  )
}

//stylesheet
const styles = StyleSheet.create({
  text162700: {
    fontSize: 16,
    fontWeight: "700",
  },
  text12w400: { fontSize: 12, fontWeight: "400" },
  text20w700: { fontSize: 20, fontWeight: "700" },
  text20w900: {
    fontSize: 20,
    fontWeight: "900",
  },
  text16w700: {
    fontSize: 16,
    fontWeight: "700",
  },
  colon: { alignSelf: "center", marginHorizontal: 4, fontSize: 14 },
})
