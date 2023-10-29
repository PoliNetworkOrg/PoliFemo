import { FC, useEffect, useRef, useState } from "react"
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Keyboard,
  Pressable,
} from "react-native"
import {
  CalendarEvent,
  CalendarEventStatus,
  ValidEmoticonName,
  emoticons,
  fromatAddEventDate,
  get1HourBeforeAfterSameDay,
  getSourceEmoticon,
  isValidEmoticonName,
} from "utils/calendar"
import { BodyText, Text } from "components/Text"
import { palette, usePalette } from "utils/colors"
import { CalendarButton } from "./Button"
import { useCurrentLanguage } from "utils/language"
import { DateTimeBox } from "components/FreeClass/DateTimePicker/DateTimeBox"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { Icon } from "components/Icon"
import { Modal } from "components/Modal"
import { useTranslation } from "react-i18next"

interface CalendarAddEventProps {
  addEvent: (event: CalendarEvent) => void
  date: string
}

type DateModeCalendar = "start" | "end" | "reminder"

export const CalendarAddEvent: FC<CalendarAddEventProps> = props => {
  const { homeBackground, isLight, primary } = usePalette()

  const lan = useCurrentLanguage()

  const dateObj = new Date(props.date)

  const [title, setTitle] = useState<string>("")

  const [isRepeating, setIsRepeating] = useState<boolean>(false)

  const [mood, setMood] = useState<ValidEmoticonName | undefined>(undefined)

  const [moodSource, setMoodSource] = useState<number | undefined>(undefined)

  const [isMoodModalShowing, setIsMoodModalShowing] = useState<boolean>(false)

  const inputText = useRef<TextInput>(null)

  const [dateModeCalendar, setDateModeCalendar] =
    useState<DateModeCalendar>("start")

  const [startDate, setStartDate] = useState<Date>(new Date())

  const [endDate, setEndDate] = useState<Date>(
    get1HourBeforeAfterSameDay(startDate, true)
  )

  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined)

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const { t } = useTranslation("calendar")

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

  const showTimePicker = (mode: DateModeCalendar) => {
    setDateModeCalendar(mode)
    setDatePickerVisibility(true)
  }

  const hideDateOrTimePicker = () => {
    setDatePickerVisibility(false)
  }

  const handleConfirm = (date: Date, mode: DateModeCalendar) => {
    hideDateOrTimePicker()
    if (mode === "start") {
      setStartDate(date)

      if (date.getTime() > endDate.getTime()) {
        setEndDate(get1HourBeforeAfterSameDay(date, true))
      }
    } else if (mode === "end") {
      setEndDate(date)

      if (date.getTime() < startDate.getTime()) {
        setStartDate(get1HourBeforeAfterSameDay(date, false))
      }
    } else {
      setReminderDate(date)
    }
  }

  const resetNewEvent = () => {
    setTitle("")
    inputText.current?.clear()
    setMood(undefined)
    setIsRepeating(false)
    const now = new Date()
    setStartDate(now)
    setEndDate(get1HourBeforeAfterSameDay(now, true))
    setReminderDate(undefined)
  }

  useEffect(() => {
    if (mood === undefined) {
      setMoodSource(undefined)
    } else {
      setMoodSource(getSourceEmoticon(mood))
    }
  }, [mood])

  useEffect(() => {
    setStartDate(new Date(props.date))
    setEndDate(get1HourBeforeAfterSameDay(new Date(props.date), true))
  }, [props.date])

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
          style={[
            styles.title,
            { color: isLight ? homeBackground : "#fff", paddingBottom: 0 },
          ]}
        >
          {t("newEvent")}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <CalendarButton
            backgroundColor={isLight ? primary : palette.lighter}
            onPress={() => {
              if (
                title.length > 0 &&
                startDate.getTime() < endDate.getTime() &&
                startDate.getDate() === endDate.getDate()
              ) {
                props.addEvent({
                  id: Date.now().toString(),
                  start: startDate.toISOString(),
                  end: endDate.toISOString(),
                  title: title,
                  mood: mood,
                  repeats: isRepeating,
                  reminder: reminderDate?.toISOString(),
                  status: CalendarEventStatus.INITIAL,
                })
              }
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "700" }}>Ok</Text>
          </CalendarButton>
          <CalendarButton
            backgroundColor={isLight ? primary : palette.lighter}
            style={{ width: 80, marginLeft: 16 }}
            onPress={() => {
              resetNewEvent()
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "700" }}>
              {t("cancel")}
            </Text>
          </CalendarButton>
        </View>
      </View>
      <Text
        style={{
          color: isLight ? homeBackground : "#fff",
          fontWeight: "400",
          fontSize: 14,
        }}
      >
        {fromatAddEventDate(dateObj, lan)}
      </Text>
      <TextInput
        style={{
          borderBottomWidth: 1,
          borderBottomColor: isLight ? homeBackground : "#fff",
          marginTop: 16,
          fontWeight: "700",
          fontSize: 16,
          paddingBottom: 2,
          color: isLight ? homeBackground : "#fff",
        }}
        onChangeText={text => {
          setTitle(text)
        }}
        ref={inputText}
        placeholderTextColor={isLight ? homeBackground : "#fff"}
        placeholder={t("addTitle") || "Aggiungi Titolo"}
      />
      <View
        style={{
          marginTop: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BodyText
            style={{
              color: isLight ? primary : "#fff",
              fontSize: 14,
              marginRight: 12,
            }}
          >
            {t("from")}
          </BodyText>
          <Pressable
            onPress={_ => {
              showTimePicker("start")
            }}
            style={{ flexDirection: "row" }}
          >
            <DateTimeBox
              value={startDate.getHours().toString().padStart(2, "0")}
              width={54}
              fullOpacity={true}
            />
            <BodyText
              style={[{ color: isLight ? primary : "#fff" }, styles.colon]}
            >
              :
            </BodyText>
            <DateTimeBox
              value={startDate.getMinutes().toString().padStart(2, "0")}
              width={54}
              fullOpacity={true}
            />
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BodyText
            style={{
              color: isLight ? primary : "#fff",
              fontSize: 14,
              marginRight: 12,
            }}
          >
            {t("to")}
          </BodyText>
          <Pressable
            onPress={_ => {
              showTimePicker("end")
            }}
            style={{ flexDirection: "row" }}
          >
            <DateTimeBox
              value={endDate.getHours().toString().padStart(2, "0")}
              width={54}
              fullOpacity={true}
            />
            <BodyText
              style={[{ color: isLight ? primary : "#fff" }, styles.colon]}
            >
              :
            </BodyText>
            <DateTimeBox
              value={endDate.getMinutes().toString().padStart(2, "0")}
              width={54}
              fullOpacity={true}
            />
          </Pressable>
        </View>
      </View>
      <View style={{ flexDirection: "row", marginTop: 24 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={[
              styles.mediumSizeText,
              { color: isLight ? homeBackground : "#fff" },
            ]}
          >
            {t("setReminder")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={_ => {
                showTimePicker("reminder")
              }}
              style={{ flexDirection: "row", marginTop: 8 }}
            >
              <DateTimeBox
                value={
                  reminderDate
                    ? reminderDate.getHours().toString().padStart(2, "0")
                    : "00"
                }
                width={54}
                fullOpacity={true}
              />
              <BodyText
                style={[{ color: isLight ? primary : "#fff" }, styles.colon]}
              >
                :
              </BodyText>
              <DateTimeBox
                value={
                  reminderDate
                    ? reminderDate.getMinutes().toString().padStart(2, "0")
                    : "00"
                }
                width={54}
                fullOpacity={true}
              />
            </Pressable>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <CalendarButton
            backgroundColor={isLight ? primary : palette.lighter}
            style={{ width: "80%" }}
            onPress={() => setIsMoodModalShowing(true)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "700" }}>Mood</Text>
              {moodSource && (
                <Icon
                  //to force rerender
                  key={moodSource}
                  scale={0.6}
                  source={moodSource}
                  style={{ marginLeft: 8 }}
                />
              )}
            </View>
          </CalendarButton>
          <CalendarButton
            backgroundColor={isLight ? primary : palette.lighter}
            style={{ width: "80%", marginTop: 8 }}
            onPress={() => {
              setIsRepeating(!isRepeating)
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "700" }}>
              {isRepeating ? t("repeat") : t("dontRepeat")}
            </Text>
          </CalendarButton>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={"time"}
        onConfirm={date => {
          handleConfirm(date, dateModeCalendar)
        }}
        onCancel={hideDateOrTimePicker}
        date={dateModeCalendar === "start" ? startDate : endDate}
      />
      <Modal
        title={t("mood")}
        isShowing={isMoodModalShowing}
        centerText={true}
        onClose={() => setIsMoodModalShowing(false)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          {Object.keys(emoticons).map((emoticon, index) => {
            if (index <= 8 && isValidEmoticonName(emoticon)) {
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    setMood(emoticon)
                    setIsMoodModalShowing(false)
                  }}
                >
                  <Icon
                    source={emoticons[emoticon]}
                    style={{ marginHorizontal: 1 }}
                  />
                </Pressable>
              )
            }
          })}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 8,
            marginBottom: 36,
          }}
        >
          {Object.keys(emoticons).map((emoticon, index) => {
            if (index > 8 && isValidEmoticonName(emoticon)) {
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    setMood(emoticon)
                    setIsMoodModalShowing(false)
                  }}
                >
                  <Icon
                    source={emoticons[emoticon]}
                    style={{ marginHorizontal: 1 }}
                  />
                </Pressable>
              )
            }
          })}
        </View>
      </Modal>
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
  colon: { alignSelf: "center", marginHorizontal: 4, fontSize: 14 },
})
