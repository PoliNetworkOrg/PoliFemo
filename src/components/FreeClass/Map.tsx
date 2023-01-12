import React, { FC } from "react"
import MapView, { Marker } from "react-native-maps"
import rooms from "pages/FreeClass/Room.json"

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
            {rooms.map(room => (
                <Marker
                    key={room.room_id}
                    coordinate={{
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        latitude: room.lat,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        longitude: room.long,
                    }}
                    title={room.name}
                ></Marker>
            ))}
        </MapView>
    )
}
