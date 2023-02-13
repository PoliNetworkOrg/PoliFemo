import React, { FC, useEffect, useState } from "react"
import { View, ActivityIndicator, Platform, Text } from "react-native"
import MapView, { Callout, Marker } from "react-native-maps"
import { PermissionStatus } from "expo-location"
import { BodyText } from "components/Text"
import { BuildingItem } from "pages/FreeClass/BuildingChoice"

interface MapProps {
    userLatitude: number
    userLongitude: number
    locationStatus: PermissionStatus
    buildingList: BuildingItem[] | undefined
    onPressMarker: (campusName: string[], buildingName: string) => void
}

/**
 * This component will handle the map and the markers that will indicate the free classrooms.
 * So far, the initial region is represented by the user coordinates.
 */
export const Map: FC<MapProps> = props => {
    const [timer, setTimer] = useState<boolean>(false)

    useEffect(() => {
        if (
            props.userLatitude === undefined &&
            props.userLongitude === undefined
        ) {
            setTimeout(() => setTimer(true), 7000)
        }
    }, [])

    return (
        <View
            style={{
                marginBottom: 100,
                paddingBottom: 130,
            }}
        >
            {props.userLatitude === undefined ||
            props.userLongitude === undefined ? (
                props.locationStatus !== PermissionStatus.GRANTED ||
                timer === true ? (
                    <BodyText
                        style={{
                            alignSelf: "center",
                            marginTop: 100,
                            color: "red",
                            fontWeight: "700",
                            fontSize: 30,
                        }}
                    >
                        Mappa non Disponibile
                    </BodyText>
                ) : (
                    <ActivityIndicator
                        style={{ marginTop: 50, marginLeft: 3 }}
                        size="large"
                    />
                )
            ) : (
                <MapView
                    style={{ marginTop: 23, width: "100%", height: "100%" }}
                    initialRegion={{
                        latitude: props.userLatitude,
                        longitude: props.userLongitude,
                        latitudeDelta: 0.002,
                        longitudeDelta: 0.002,
                    }}
                    showsUserLocation={true}
                    mapPadding={{
                        top: 0,
                        right: 0,
                        bottom: Platform.OS === "ios" ? 185 : 180,
                        left: 0,
                    }}
                >
                    {props.buildingList?.map((building, index) => (
                        <Marker
                            key={index}
                            coordinate={
                                building.latitude !== undefined &&
                                building.longitude !== undefined
                                    ? {
                                          latitude: building.latitude,
                                          longitude: building.longitude,
                                      }
                                    : { latitude: 0, longitude: 0 } // fa schifo sta soluzione ma è l'unica che non mi dà errori.
                                    //come faccio in questi casi quando le props latitude e longitude del marker non possono essere undefined?
                            }
                        >
                            <Callout
                                onPress={() =>
                                    props.onPressMarker(
                                        building.campus.name,
                                        building.name
                                    )
                                }
                            >
                                <Text>{building.name}</Text>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            )}
        </View>
    )
}
