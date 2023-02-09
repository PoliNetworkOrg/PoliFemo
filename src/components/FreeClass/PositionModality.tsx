import React, { FC, useEffect, useState } from "react"
import { View, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { Map } from "./Map"
import { FreeClassList } from "./FreeClassList"
import { PermissionStatus } from "expo-location"
import { BuildingItem } from "pages/FreeClass/BuildingChoice"
import { RoomSimplified } from "api/rooms"
import { CampusItem } from "pages/FreeClass/CampusChoice"

interface PositionModalityProps {
    currentCoords: number[]
    locationStatus: PermissionStatus
    buildingList: BuildingItem[] | undefined
}

enum ButtonType {
    MAP,
    LIST,
}

/**
 * It handles the button's state and the two modality: Map or List.
 */
export const PositionModality: FC<PositionModalityProps> = props => {
    const { primary, isDark, palette } = usePalette()

    const [status, setStatus] = useState<ButtonType>(ButtonType.MAP)

    const [roomList, setRoomList] = useState<RoomSimplified[]>([])

    const [campusList, setCampusList] = useState<CampusItem[]>([])

    const extractRooms = (campusName: string[]) => {
        const tempRooms: RoomSimplified[] = []
        props.buildingList?.map(building => {
            if (campusName.length > 1) {
                if (
                    campusName[0] === building.campus.name[0] &&
                    campusName[1] === building.campus.name[1]
                ) {
                    tempRooms.push(...building.freeRoomList)
                }
            } else {
                if (campusName[0] === building.campus.name[0]) {
                    tempRooms.push(...building.freeRoomList)
                }
            }
        })
        setRoomList(tempRooms)
    }

    const extractCampus = () => {
        const tempCampus: CampusItem[] = []
        props.buildingList?.map(building => {
            if (!tempCampus.includes(building.campus)) {
                tempCampus.push(building.campus)
            }
        })
        setCampusList(tempCampus)
    }

    useEffect(() => {
        extractCampus()
    }, [props.buildingList])

    return (
        <>
            <View
                style={{
                    marginTop: 22,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <Pressable
                    style={{
                        width: 134,
                        height: 44,
                        backgroundColor:
                            status === ButtonType.MAP
                                ? primary
                                : isDark
                                ? palette.primary
                                : palette.lighter,
                        borderRadius: 22,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => setStatus(ButtonType.MAP)}
                >
                    <BodyText
                        style={{
                            fontWeight:
                                status === ButtonType.MAP ? "900" : "500",
                            color: "white",
                        }}
                    >
                        Mappa
                    </BodyText>
                </Pressable>
                <Pressable
                    style={{
                        width: 134,
                        height: 44,
                        backgroundColor:
                            status === ButtonType.LIST
                                ? primary
                                : isDark
                                ? palette.primary
                                : palette.lighter,
                        borderRadius: 22,
                        marginLeft: 18,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => setStatus(ButtonType.LIST)}
                >
                    <BodyText
                        style={{
                            fontWeight:
                                status === ButtonType.LIST ? "900" : "500",
                            color: "white",
                        }}
                    >
                        Lista
                    </BodyText>
                </Pressable>
            </View>
            {status === ButtonType.LIST ? (
                <View
                    style={{
                        flex: 1,
                        marginTop: -4,
                        marginBottom: 93,
                    }}
                >
                    <FreeClassList data={roomList} />
                </View>
            ) : (
                <Map
                    userLatitude={props.currentCoords[0]}
                    userLongitude={props.currentCoords[1]}
                    locationStatus={props.locationStatus}
                    campusList={campusList}
                    onPressMarker={(campusName: string[]) => {
                        setStatus(ButtonType.LIST)
                        void extractRooms(campusName)
                    }}
                />
            )}
        </>
    )
}
