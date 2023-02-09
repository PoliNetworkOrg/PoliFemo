import React, { FC, useEffect, useState } from "react"
import { View, ActivityIndicator, Platform, Text } from "react-native"
import MapView, { Callout, Marker } from "react-native-maps"
import { PermissionStatus } from "expo-location"
import { BodyText } from "components/Text"
import { CampusItem } from "pages/FreeClass/CampusChoice"

interface MapProps {
    userLatitude: number
    userLongitude: number
    locationStatus: PermissionStatus
    campusList: CampusItem[]
    onPressMarker: (campusName: string[]) => void
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
            setTimeout(() => setTimer(true), 5000)
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
                        bottom: Platform.OS === "ios" ? 190 : 180,
                        left: 0,
                    }}
                >
                    {props.campusList.map((campus, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: campus.latitude,
                                longitude: campus.longitude,
                            }}
                        >
                            <Callout
                                onPress={() => props.onPressMarker(campus.name)}
                            >
                                {campus.name.length > 1 ? (
                                    <Text>
                                        {campus.name[0] + " " + campus.name[1]}
                                    </Text>
                                ) : (
                                    <Text>{campus.name[0]}</Text>
                                )}
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            )}
        </View>
    )
}
