import React, { FC, useEffect, useState } from "react"
import {
  View,
  ActivityIndicator,
  Platform,
  Text,
  Pressable,
} from "react-native"
import MapView, { Callout, Marker, Region } from "react-native-maps"
import { PermissionStatus } from "expo-location"
import { BodyText } from "components/Text"
import { BuildingItem } from "pages/FreeClass/BuildingChoice"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface MapProps {
  userLatitude: number
  userLongitude: number
  locationStatus: PermissionStatus
  buildingList: BuildingItem[] | undefined
  onPressMarker: (building: BuildingItem) => void
}

/**
 * This component will handle the map and the markers that will indicate the free classrooms.
 * So far, the initial region is represented by the user coordinates.
 */
export const Map: FC<MapProps> = props => {
  const [timer, setTimer] = useState<boolean>(false)

  const [region, setRegion] = useState<Region>()

  useEffect(() => {
    if (props.userLatitude === undefined && props.userLongitude === undefined) {
      setTimeout(() => setTimer(true), 20000) //20 sec
    }
  }, [])

  useEffect(() => {
    AsyncStorage.getItem("lastRegionVisited")
      .then(regionJSON => {
        if (regionJSON) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const tempRegion: Region = JSON.parse(regionJSON)
          setRegion(tempRegion)
        }
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <View
      style={{
        marginBottom: 100,
        paddingBottom: 130,
      }}
    >
      {props.userLatitude === undefined || props.userLongitude === undefined ? (
        props.locationStatus !== PermissionStatus.GRANTED || timer === true ? (
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
          region={
            region !== undefined
              ? region
              : {
                  latitude: props.userLatitude,
                  longitude: props.userLongitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }
          }
          onRegionChangeComplete={region => {
            setRegion(region)
            AsyncStorage.setItem(
              "lastRegionVisited",
              JSON.stringify(region)
            ).catch(err => console.log(err))
          }}
          showsUserLocation={true}
          mapPadding={{
            top: 0,
            right: 0,
            bottom: Platform.OS === "ios" ? 170 : 165,
            left: 0,
          }}
        >
          {Platform.OS === "ios" ? (
            <Pressable
              //this pressable is a button to return to user current location, on MapKit this feature is not provided by react-native-maps
              style={{
                backgroundColor: "red",
                width: 30,
                height: 30,
                alignSelf: "flex-end",
                marginRight: 12,
                marginTop: 55,
                borderRadius: 5,
              }}
              onPress={() => {
                const region: Region = {
                  latitude: props.userLatitude,
                  longitude: props.userLongitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }
                setRegion(region)
                AsyncStorage.setItem(
                  "lastRegionVisited",
                  JSON.stringify(region)
                ).catch(err => console.log(err))
              }}
            />
          ) : undefined}
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
              <Callout onPress={() => props.onPressMarker(building)}>
                <Text>{building.name}</Text>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  )
}
