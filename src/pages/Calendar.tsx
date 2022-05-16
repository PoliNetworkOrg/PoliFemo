import React, { useState } from "react"
import { RefreshControl, ScrollView } from "react-native"
import { Calendar, LocaleConfig } from "react-native-calendars"
import { RootStackScreen } from "../navigation/NavigationTypes"
import { formatDate } from "../util"

const colors = ["#aadff2"]

LocaleConfig.locales["it"] = {
    monthNames: [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre",
    ],
    monthNamesShort: [
        "Gen.",
        "Feb.",
        "Mar.",
        "Apr.",
        "Mag.",
        "Giu.",
        "Lug.",
        "Ago.",
        "Set.",
        "Ott.",
        "Nov.",
        "Dic.",
    ],
    dayNames: [
        "Domenica",
        "Lunedì",
        "Martedì",
        "Mercoledì",
        "Giovedì",
        "Venerdì",
        "Sabato",
    ],
    dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mer.", "Gio.", "Ven.", "Sab."],
}
LocaleConfig.defaultLocale = "it"

const onceDayIsPressed = (day: string): void => {
    console.log(`Day ${day} is pressed`)
}

export const CalendarPage: RootStackScreen<"Calendar"> = ({ navigation }) => {
    const today = new Date()
    const minimum = formatDate(today)

    const [selected, setSelected] = useState(minimum)
    const [refreshing, setRefreshing] = useState(false)

    return (
        <ScrollView
            style={{ minHeight: "100%" }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true)
                        setRefreshing(false)
                    }}
                    tintColor="#ddd"
                />
            }
        >
            <Calendar
                current={minimum}
                minDate={minimum}
                onDayPress={day => onceDayIsPressed(day.dateString)}
                //onDayLongPress={day => onceDayIsPressed(day.dateString)} //NON RIMOUOVERE QUESTA LINEA PER NESSUN CAZZO DI MOTIVO
                hideArrows={true}
                hideExtraDays={true}
                firstDay={7}
                enableSwipeMonths={true} //TODO: da rimuovere
                theme={{
                    backgroundColor: "#ffffff",
                    calendarBackground: colors[0],
                    textSectionTitleColor: "#b6c1cd",
                    textSectionTitleDisabledColor: "#d9e1e8",
                    selectedDayBackgroundColor: "#00adf5",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: "#ff00ff",
                    dayTextColor: "#fff",
                    textDisabledColor: "#d9e1e8",
                    dotColor: "#00adf5",
                    selectedDotColor: "#ffffff",
                    arrowColor: "orange",
                    disabledArrowColor: "#d9e1e8",
                    monthTextColor: "blue",
                    indicatorColor: "blue",
                    textDayFontFamily: "monospace",
                    textMonthFontFamily: "monospace",
                    textDayHeaderFontFamily: "monospace",
                    textDayFontWeight: "300",
                    textMonthFontWeight: "bold",
                    textDayHeaderFontWeight: "300",
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16,
                }} //TODO: la gestione centralizzata dei colori
                markingType="multi-period"
                markedDates={{
                    "2022-05-16": {
                        periods: [
                            {
                                startingDay: false,
                                endingDay: true,
                                color: "#5f9ea0",
                            },
                            {
                                startingDay: false,
                                endingDay: true,
                                color: "#ffa500",
                            },
                            {
                                startingDay: true,
                                endingDay: false,
                                color: "#f0e68c",
                            },
                        ],
                    },
                    "2022-05-19": {
                        periods: [
                            {
                                startingDay: true,
                                endingDay: false,
                                color: "#ffa500",
                            },
                            { color: "transparent" },
                            {
                                startingDay: false,
                                endingDay: false,
                                color: "#f0e68c",
                            },
                        ],
                    },
                }}
            />
        </ScrollView>
    )
}
