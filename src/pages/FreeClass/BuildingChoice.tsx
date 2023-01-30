import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import React, { useState, useEffect } from "react"
import { View, FlatList, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import { Title, BodyText } from "components/Text"
import { NavBar } from "components/NavBar"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { api } from "api"
import { CampusItem } from "./CampusChoice"

export interface BuildingItem {
    campus: CampusItem
    name: string
    freeRoomList: string[] 
}

/**
 * In this page the user can select the building.
 */
export const BuildingChoice: MainStackScreen<"BuildingChoice"> = props => {
    const { palette, background, homeBackground } = usePalette()
    const { navigate } = useNavigation()

    const { campus, currentDate } = props.route.params

    const [buildingList, setBuildingList] = useState<BuildingItem[]>()

    //non-ISO format for simplicity (local timezone) and
    // compatibility with `handleConfirm` function
    const [date, setDate] = useState<Date>(
        new Date(currentDate) !== new Date()
            ? new Date(currentDate)
            : new Date()
    )

    function addHours(dateStart: Date, hours: number) {
        const tempDate= new Date(dateStart.getTime())
        tempDate.setHours(tempDate.getHours() + hours)
        return tempDate
    }

    //the dateEnd is the startDate + five hours, the number of hours has not been chosen yet
    const dateEnd = addHours(date, 5).toISOString() //5 hours is an example

    //main function that handles the call to the API in order to obtain the list of freeclassRooms
    const findRoomsAvailable = async () => {
        try {
            const response = await api.rooms.getFreeRoomsTimeRange(
                campus.acronym,
                date.toISOString(),
                dateEnd
            )
            if (response.length > 0) {

                const tempBuildingStrings: string[] = []
                const tempBuildings : BuildingItem[] = []
                response.map(room => {
                    const currentBuildingString = room.building.replace(
                        "Edificio ",
                        "Ed. "
                    )
                    if (!tempBuildingStrings.includes(currentBuildingString)) {
                        const currentBuilding : BuildingItem = {
                            campus: campus,
                            name: room.building.replace(
                                "Edificio ",
                                "Ed. "
                            ),
                            freeRoomList: [room.name]
                        }
                        tempBuildingStrings.push(currentBuildingString)
                        tempBuildings.push(currentBuilding)
                    }
                    else{
                        //element already present in the list
                        const indexElement = tempBuildingStrings.indexOf(currentBuildingString)
                        tempBuildings[indexElement].freeRoomList.push(room.name)
                    }
                })
                setBuildingList(tempBuildings)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        findRoomsAvailable().finally(() => console.log("Rooms Retrieved"))
    }, [date])

    useEffect(() => {
        setDate(new Date(currentDate))
    }, [props.route.params.currentDate])

    //custom goBack function, in order to maintain the currentDate.
    const goBack = () => {
        props.navigation.navigate("CampusChoice", {
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
                                        marginBottom: 34,
                                        alignItems: "center",
                                    }}
                                    onPress={() =>
                                        navigate("ClassChoice", {
                                            building: item,
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
                                            {item.name}
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
