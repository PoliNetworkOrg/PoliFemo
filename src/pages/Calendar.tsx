import React, { useState } from "react"
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native"
import { Calendar, LocaleConfig, CalendarList } from "react-native-calendars"
import { RootStackScreen } from "../navigation/NavigationTypes"
import { formatDate } from "../util"

const colors = ["#726FBF", "#DBD5F2"]

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
    today: "Oggi",
}
LocaleConfig.defaultLocale = "it"

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
            <CalendarList
                current={selected}
                firstDay={1}
                markedDates={{}}
                minDate={minimum}
                onDayPress={day => {
                    setSelected(day.dateString)
                }}
                markingType={"multi-dot"}
                hideExtraDays={false}
                disableArrowLeft={true}
                disableAllTouchEventsForDisabledDays={false}
                pastScrollRange={0}
                scrollEnabled={true}
                showScrollIndicator={false}
                horizontal={true}
                pagingEnabled={true}
                theme={{
                    todayTextColor: colors[1],
                    calendarBackground: colors[0],
                    dayTextColor: "#fff",
                    textDisabledColor: "#aaa",
                    monthTextColor: "#fff",
                }}
                style={{
                    borderBottomWidth: 2,
                    borderBottomColor: "#fff",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                }}
            />
        </ScrollView>
    )
}
