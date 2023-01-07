import React, { FC, useState } from "react"
import { Pressable, View } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { DateTimeBox } from "./DateTimeBox"
import { destructureDate } from "utils/dates"
import DateTimePickerModal from "react-native-modal-datetime-picker"
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
        props.setDate(date)
        console.log("A date has been picked: ", date)
        hideDateOrTimePicker()
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
                    <Text
                        style={{
                            color: isLight ? primary : "#fff",
                            fontSize: 14,
                        }}
                    >
                        Date
                    </Text>
                </View>
                <Pressable
                    onPress={showDatePicker}
                    style={{ flexDirection: "row" }}
                >
                    <DateTimeBox value={day} />
                    <DateTimeBox value={month} />
                    <DateTimeBox value={year} />
                </Pressable>
                <View>
                    <Text
                        style={{
                            color: isLight ? primary : "#fff",
                            fontSize: 14,
                            marginLeft: 28,
                        }}
                    >
                        Time
                    </Text>
                </View>
                <Pressable
                    onPress={showTimePicker}
                    style={{ flexDirection: "row" }}
                >
                    <DateTimeBox value={hour} />
                    <DateTimeBox value={minute} />
                </Pressable>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={dateMode}
                onConfirm={handleConfirm}
                onCancel={hideDateOrTimePicker}
            />
        </View>
    )
}
