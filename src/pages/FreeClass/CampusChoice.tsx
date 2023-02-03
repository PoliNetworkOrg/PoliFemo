import React, { useEffect, useState } from "react"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View, Pressable, FlatList } from "react-native"
import { usePalette } from "utils/colors"
import { NavBar } from "components/NavBar"
import { Title, BodyText } from "components/Text"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"

export interface CampusItem {
    name: string[]
    acronym: string
    latitude: number
    longitude: number
}

export const campusList: CampusItem[] = [
    {
        name: ["Bovisa", "Durando"],
        acronym: "MIB",
        latitude: 45.504422059752116,
        longitude: 9.164129368703703,
    },
    {
        name: ["Bovisa", "La Masa"],
        acronym: "MIB",
        latitude: 45.50286551603009,
        longitude: 9.156452626872522,
    },
    {
        name: ["Leonardo"],
        acronym: "MIA",
        latitude: 45.47791263153159,
        longitude: 9.227122387828846,
    },
    {
        name: ["Colombo"],
        acronym: "MIA",
        latitude: 45.47190973697382,
        longitude: 9.227048868730659,
    },
    {
        name: ["Mancinelli"],
        acronym: "MIA",
        latitude: 45.49016811534536,
        longitude: 9.227177297538793,
    },
]

/**
 * In this page the user can select the campus.
 */
export const CampusChoice: MainStackScreen<"CampusChoice"> = props => {
    const { navigate } = useNavigation()
    const { homeBackground, background, palette } = usePalette()

    const { currentDate } = props.route.params

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
                        <Title style={{ fontSize: 40 }}>Campus</Title>
                    </View>
                    <DateTimePicker
                        date={date}
                        setDate={(date: Date) => setDate(date)}
                    />
                    <View
                        style={{
                            height: "100%",
                            marginTop: 26,
                        }}
                    >
                        <FlatList
                            showsVerticalScrollIndicator={true}
                            numColumns={2}
                            style={{ marginTop: 27 }}
                            columnWrapperStyle={{
                                justifyContent: "space-between",
                                marginHorizontal: 22,
                            }}
                            data={campusList}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={{
                                        backgroundColor: palette.primary,
                                        borderRadius: 12,
                                        width: "45%",
                                        height: 93,
                                        marginHorizontal: 9,
                                        marginBottom: 54,
                                        alignItems: "center",
                                    }}
                                    onPress={() =>
                                        navigate("BuildingChoice", {
                                            campus: item,
                                            currentDate: date.toISOString(),
                                        })
                                    }
                                >
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <BodyText
                                            style={{
                                                fontWeight:
                                                    item.name.length > 1
                                                        ? "300"
                                                        : "900",
                                                color: "white",
                                                fontSize: 20,
                                                textAlign: "center",
                                            }}
                                        >
                                            {item.name[0]}
                                        </BodyText>
                                        {item.name.length > 1 ? (
                                            <BodyText
                                                style={{
                                                    fontWeight: "900",
                                                    color: "white",
                                                    fontSize: 20,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {item.name[1]}
                                            </BodyText>
                                        ) : undefined}
                                    </View>
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            </View>
            <NavBar />
        </View>
    )
}
