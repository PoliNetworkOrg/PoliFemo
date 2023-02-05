import React, { FC } from "react"
import { View, ActivityIndicator } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { PermissionStatus } from "expo-location"
import { BodyText } from "components/Text"

interface MapProps {
    userLatitude: number
    userLongitude: number
    locationStatus: PermissionStatus
    currentCampus?: number[]
    onPressMarker: () => void
}

/**
 * This component will handle the map and the markers that will indicate the free classrooms.
 * So far, the initial region is represented by the user coordinates.
 */
export const Map: FC<MapProps> = props => {
    return (
        <View
            style={{
                marginBottom: 100,
                paddingBottom: 130,
            }}
        >
            {props.userLatitude === undefined || props.userLongitude === undefined ? (
                props.locationStatus !== PermissionStatus.GRANTED ? (
                    <BodyText
                        style={{
                            alignSelf: "center",
                            marginTop: 50,
                            color: "red",
                            fontWeight: "900",
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
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003,
                    }}
                    showsUserLocation={true}
                    mapPadding={{
                        top: 0,
                        right: 0,
                        bottom: 190,
                        left: 0,
                    }}
                >
                    {props.currentCampus !== undefined ? (
                        <Marker
                            coordinate={{
                                latitude: props.currentCampus[0],
                                longitude: props.currentCampus[1],
                            }}
                            onPress={() => props.onPressMarker()}
                        ></Marker>
                    ) : undefined}
                </MapView>
            )}
        </View>
    )
}
