import React, { FC, useState } from "react"
import { View, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { Map } from "./Map"
import { FreeClassList } from "./FreeClassList"
import { PermissionStatus } from "expo-location"
import { RoomSimplified } from "api/Room"

interface PositionModalityProps {
    currentCoords: number[]
    locationStatus: PermissionStatus
    currentCampus: number[]
    roomList: RoomSimplified[]
}

enum ButtonType {
    MAP,
    LIST,
}

export const PositionModality: FC<PositionModalityProps> = props => {
    const { primary, isDark, palette } = usePalette()

    const [status, setStatus] = useState<ButtonType>(ButtonType.MAP)

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
                    <FreeClassList data={props.roomList} />
                </View>
            ) : (
                <Map
                    userLatitude={props.currentCoords[0]}
                    userLongitude={props.currentCoords[1]}
                    locationStatus={props.locationStatus}
                    currentCampus={props.currentCampus}
                    onPressMarker={() => setStatus(ButtonType.LIST)}
                />
            )}
        </>
    )
}
