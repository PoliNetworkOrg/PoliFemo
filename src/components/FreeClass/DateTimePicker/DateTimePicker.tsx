import React, { FC, useState } from "react"
import { Pressable, View } from "react-native"
import { BodyText } from "components/Text"
import { usePalette } from "utils/colors"
import { DateTimeBox } from "./DateTimeBox"
import { destructureDate } from "utils/functions"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { StyleSheet } from "react-native"

export interface DateTimePickerProps {
  date: Date
  setDate: (date: Date) => void
}

/**
 * custom DateTime picker
 */
export const DateTimePicker: FC<DateTimePickerProps> = props => {
  const { year, month, day, hour, minute } = destructureDate(props.date)
  const { isLight, primary } = usePalette()

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  //there would be also "date-time" but we don't use it
  const [dateMode, setDateMode] = useState<"date" | "time">("date")

  const showDatePicker = () => {
    setDateMode("date")
    setDatePickerVisibility(true)
  }

  const showTimePicker = () => {
    setDateMode("time")
    setDatePickerVisibility(true)
  }

  const hideDateOrTimePicker = () => {
    setDatePickerVisibility(false)
  }

  const handleConfirm = (date: Date) => {
    hideDateOrTimePicker()
    props.setDate(date)
  }
  return (
    <View>
      <View
        style={{
          marginTop: 46,
          width: "100%",
          height: 27,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View>
          <BodyText
            style={{
              color: isLight ? primary : "#fff",
              fontSize: 14,
              marginRight: 12,
            }}
          >
            Data
          </BodyText>
        </View>
        <Pressable onPress={showDatePicker} style={{ flexDirection: "row" }}>
          <DateTimeBox value={day} />
          <BodyText style={[{ color: isLight ? primary : "#fff" }, styles.dot]}>
            .
          </BodyText>
          <DateTimeBox value={month} />
          <BodyText style={[{ color: isLight ? primary : "#fff" }, styles.dot]}>
            .
          </BodyText>
          <DateTimeBox value={year} />
        </Pressable>
        <View>
          <BodyText
            style={{
              color: isLight ? primary : "#fff",
              fontSize: 14,
              marginLeft: 28,
              marginRight: 12,
            }}
          >
            Ora
          </BodyText>
        </View>
        <Pressable onPress={showTimePicker} style={{ flexDirection: "row" }}>
          <DateTimeBox value={hour} />
          <BodyText
            style={[{ color: isLight ? primary : "#fff" }, styles.colon]}
          >
            :
          </BodyText>
          <DateTimeBox value={minute} />
        </Pressable>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={dateMode}
        onConfirm={handleConfirm}
        onCancel={hideDateOrTimePicker}
        date={props.date}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  dot: {
    alignSelf: "flex-end",
    marginHorizontal: 4,
    fontSize: 14,
  },
  colon: { alignSelf: "center", marginHorizontal: 4, fontSize: 14 },
})
