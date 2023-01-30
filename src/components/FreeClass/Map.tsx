import React, { FC } from "react"
import MapView from "react-native-maps"

export const Map: FC = () => {
    return (
        <MapView
            style={{ marginTop: 23, width: "100%", height: "100%" }}
            initialRegion={{
                latitude: 45.47823,
                longitude: 9.22724,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
        >
        </MapView>
    )
}
