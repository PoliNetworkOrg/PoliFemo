import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import React, { useState, useEffect } from "react"
import { View, FlatList, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import { Title, BodyText } from "components/Text"
import { NavBar } from "components/NavBar"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { Room } from "api/Room"
import { api, RetryType } from "api"

export const BuildingChoice: MainStackScreen<"BuildingChoice"> = props => {
    const { palette, background, homeBackground } = usePalette()
    const { navigate } = useNavigation()

    const { campus, currentDate } = props.route.params

    const [roomList, setRoomList] = useState<Room[]>()

    const [buildingList, setBuildingList] = useState<string[]>()

    const [isBuildingListFound, setBuildingListFound] = useState(false)

    const dateEnd = new Date(currentDate).setHours(
        new Date(currentDate).getHours() + 2
    )

    const findRoomsAvailable = async () => {
        try {
            const response = await api.rooms.getFreeRoomsTimeRange(
                "MIB",
                "2022-05-18T12:15:00Z",
                "2022-05-18T14:15:00Z",
            )
            setRoomList(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!isBuildingListFound) {
            findRoomsAvailable().catch(console.error)
            if (roomList !== undefined) {
                const tempBuildings: string[] = []
                roomList.map(room => {
                    const currentBuilding = room.building.replace(
                        "Edificio ",
                        ""
                    )
                    if (!tempBuildings.includes(currentBuilding)) {
                        tempBuildings.push(currentBuilding)
                    }
                })
                setBuildingList(tempBuildings)
                setBuildingListFound(true)
            } else {
                console.log("roomList empty")
            }
        } else {
            undefined
        }
    }, [roomList])

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
        props.navigation.navigate("CampusChoice", {
            currentDate: date.toString(),
        })
    }

    const [refreshing, setRefreshing] = useState<boolean>(false)

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
                        {campus.name.length > 1 ? (
                            <Title
                                style={{
                                    fontSize: 40,
                                    fontWeight: "300",
                                    fontFamily: "Roboto_300Light",
                                }}
                            >
                                {campus.name[0]}
                                <Title
                                    style={{ fontSize: 40, fontWeight: "900" }}
                                >
                                    {" " + campus.name[1]}
                                </Title>
                            </Title>
                        ) : (
                            <Title style={{ fontSize: 40, fontWeight: "900" }}>
                                {campus.name}
                            </Title>
                        )}
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
                            refreshing={refreshing}
                            onRefresh={() => console.log("refreshing!")}
                            showsVerticalScrollIndicator={true}
                            style={{ marginTop: 27, marginBottom: 35 }}
                            numColumns={2}
                            columnWrapperStyle={{
                                justifyContent: "space-between",
                                marginHorizontal: 22,
                            }}
                            data={buildingList}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={{
                                        backgroundColor: palette.primary,
                                        borderRadius: 12,
                                        width: "45%",
                                        height: 93,
                                        marginHorizontal: 9,
                                        //marginVertical: 17,
                                        marginBottom: 34,
                                        alignItems: "center",
                                    }}
                                    onPress={() =>
                                        navigate("ClassChoice", {
                                            building: item,
                                            campus: campus,
                                            currentDate: date.toString(),
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
                                                fontWeight: "300",
                                                color: "white",
                                                fontSize: 36,
                                                textAlign: "center",
                                            }}
                                        >
                                            {item}
                                        </BodyText>
                                    </View>
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            </View>
            <NavBar overrideBackBehavior={goBack} />
        </View>
    )
}
