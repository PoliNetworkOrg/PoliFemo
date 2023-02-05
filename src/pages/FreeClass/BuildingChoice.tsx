import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import React, { useState, useEffect } from "react"
import { View, FlatList, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import { Title, BodyText } from "components/Text"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { api, RetryType } from "api"
import { CampusItem } from "./CampusChoice"
import { PageWrapper } from "components/Groups/PageWrapper"

export interface BuildingItem {
    campus: CampusItem
    name: string
    freeRoomList: number[]
}

/**
 * In this page the user can select the building.
 */
export const BuildingChoice: MainStackScreen<"BuildingChoice"> = props => {
    const { palette } = usePalette()
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
        const tempDate = new Date(dateStart.getTime())
        tempDate.setHours(tempDate.getHours() + hours)
        return tempDate
    }

    //the dateEnd is the startDate + 8 hours, the number of hours has not been chosen yet
    const dateEnd = addHours(date, 8).toISOString() //8 hours is an example

    //main function that handles the call to the API in order to obtain the list of freeclassRooms
    const findRoomsAvailable = async () => {
        try {
            const response = await api.rooms.getFreeRoomsTimeRange(
                campus.acronym,
                date.toISOString(),
                dateEnd,
                { maxRetries: 1, retryType: RetryType.RETRY_N_TIMES }
            )
            if (response.length > 0) {
                const tempBuildingStrings: string[] = []
                const tempBuildings: BuildingItem[] = []
                response.map(room => {
                    const currentBuildingString = room.building.replace(
                        "Edificio ",
                        "Ed. "
                    )
                    if (!tempBuildingStrings.includes(currentBuildingString)) {
                        const currentBuilding: BuildingItem = {
                            campus: campus,
                            name: room.building.replace("Edificio ", "Ed. "),
                            freeRoomList: [room.room_id],
                        }
                        tempBuildingStrings.push(currentBuildingString)
                        tempBuildings.push(currentBuilding)
                    } else {
                        //element already present in the list
                        const indexElement = tempBuildingStrings.indexOf(
                            currentBuildingString
                        )
                        tempBuildings[indexElement].freeRoomList.push(
                            room.room_id
                        )
                    }
                })
                setBuildingList(tempBuildings)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        void findRoomsAvailable()
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
        <PageWrapper navbarOptions={{ overrideBackBehavior: () => goBack() }}>
            <View style={{ paddingTop: 28 }}>
                {campus.name.length > 1 ? (
                    <Title
                        style={{
                            paddingLeft: 28,
                            fontWeight: "300",
                            fontFamily: "Roboto_300Light",
                        }}
                    >
                        {campus.name[0]}
                        <Title>{" " + campus.name[1]}</Title>
                    </Title>
                ) : (
                    <Title style={{ paddingLeft: 28 }}>{campus.name}</Title>
                )}
                <DateTimePicker
                    date={date}
                    setDate={(date: Date) => setDate(date)}
                />
            </View>
            <FlatList
                showsVerticalScrollIndicator={true}
                style={{
                    flex: 1,
                    marginTop: 53,
                    marginBottom: 93,
                }}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginHorizontal: 22,
                    paddingBottom: 34,
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
        </PageWrapper>
    )
}
