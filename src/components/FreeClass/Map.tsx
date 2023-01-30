import React, { FC } from "react"
import MapView from "react-native-maps"

interface MapProps {
    latitude: number
    longitude: number
}

/**
 * This component will handle the map and the markers that will indicate the free classrooms.
 * So far, the initial region is represented by the user coordinates.
 */
export const Map: FC<MapProps> = props => {
    return (
        <MapView
            style={{ marginTop: 23, width: "100%", height: "100%" }}
            initialRegion={{
                latitude: props.latitude,
                longitude: props.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
        ></MapView>
    )
}
