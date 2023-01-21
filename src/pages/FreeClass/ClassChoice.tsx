import { MainStackScreen } from "navigation/NavigationTypes"
import React, { useState, useEffect } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { Title } from "components/Text"
import { NavBar } from "components/NavBar"
import { FreeClassList } from "components/FreeClass/FreeClassList"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"

export const ClassChoice: MainStackScreen<"ClassChoice"> = props => {
    const { background, homeBackground } = usePalette()

    const { building, campus, currentDate } = props.route.params

    //non-ISO format for simplicity (local timezone) and
    // compatibility with `handleConfirm` function
    const [date, setDate] = useState<Date>(
        new Date(currentDate) !== new Date()
            ? new Date(currentDate)
            : new Date()
    )

    useEffect(() => {
        setDate(new Date(currentDate))
    }, [props.route.params.currentDate])

    const goBack = () => {
        props.navigation.navigate("BuildingChoice", {
            campus: campus,
            currentDate: date.toString(),
        })
    }

    return (
        <View
            style={{
                flex: 1,
                alignItems: "stretch",
                backgroundColor: homeBackground,
            }}
        >
            <View
                style={{
                    flex: 1,
                    marginTop: 106,
                }}
            >
                <View
                    style={{
                        paddingBottom: 400,
                        backgroundColor: background,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,

                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.43,
                        shadowRadius: 9.51,

                        elevation: 15,
                    }}
                >
                    <View
                        //view containing the title
                        style={{
                            paddingHorizontal: 28,
                            marginTop: 28,
                        }}
                    >
                        <Title style={{ fontSize: 40, fontWeight: "900" }}>
                            {building}
                        </Title>
                    </View>
                    <DateTimePicker
                        date={date}
                        setDate={(date: Date) => setDate(date)}
                    />
                    <View style={{ height: "100%", marginTop: 26 }}>
                        <FreeClassList />
                    </View>
                </View>
            </View>
            <NavBar overrideBackBehavior={goBack} />
        </View>
    )
}
