import { FC, useEffect, useState } from "react"
import { View, ActivityIndicator, Platform, Pressable } from "react-native"
import MapView, { Callout, Marker, Region } from "react-native-maps"
import { PermissionStatus } from "expo-location"
import { BodyText } from "components/Text"
import { BuildingItem, CampusItem } from "./DefaultList"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Icon } from "components/Icon"
import iconMaps from "assets/freeClassrooms/iconMaps.svg"
import { ErrorMessage } from "components/ErrorMessage"

interface MapProps {
  userLatitude: number
  userLongitude: number
  locationStatus: PermissionStatus
  buildingList: BuildingItem[] | undefined
  campusSearched: CampusItem | undefined
  onPressMarker: (building: BuildingItem) => void
}

/**
 * This component will handle the map and the markers that will indicate the free classrooms.
 * So far, the initial region is represented by the user coordinates.
 */
export const Map: FC<MapProps> = props => {
  const [timer, setTimer] = useState<boolean>(false)

  const [region, setRegion] = useState<Region>({
    latitude: props.userLatitude,
    longitude: props.userLongitude,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  })

  useEffect(() => {
    if (props.userLatitude === undefined && props.userLongitude === undefined) {
      setTimeout(() => setTimer(true), 20000) //20 sec
    }
  }, [])

  useEffect(() => {
    const region: Region = {
      latitude: props.campusSearched?.latitude ?? 45.464172826394595,
      longitude: props.campusSearched?.longitude ?? 9.189523238744504,
      latitudeDelta:
        props.campusSearched?.latitude !== undefined ? 0.0035 : 2.5,
      longitudeDelta:
        props.campusSearched?.latitude !== undefined ? 0.0035 : 2.5,
    }
    setRegion(region)
  }, [props.campusSearched])

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
          <ErrorMessage
            message="Mappa non disponibile"
            styleView={{
              marginTop: 100,
            }}
            styleMessage={{
              alignSelf: "center",
              color: "red",
              fontWeight: "400",
              fontSize: 30,
            }}
          />
        ) : (
          <ActivityIndicator
            style={{ marginTop: 50, marginLeft: 3 }}
            size="large"
          />
        )
      ) : (
        <MapView
          style={{ marginTop: 23, width: "100%", height: "100%" }}
          region={region}
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
            bottom: Platform.OS === "ios" ? 175 : 170,
            left: 0,
          }}
        >
          {Platform.OS === "ios" ? (
            <Pressable
              //this pressable is a button to return to user current location, on MapKit this feature is not provided by react-native-maps
              style={{
                position: "absolute",
                bottom: 200,
                right: 5,
                width: 43,
                height: 43,
                alignSelf: "flex-end",
                borderRadius: 20,
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
            >
              <Icon source={iconMaps} scale={0.5} />
            </Pressable>
          ) : undefined}
          {props.buildingList
            ?.filter(b => b.latitude && b.longitude)
            .map((building, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: building.latitude ?? 0,
                  longitude: building.longitude ?? 0,
                }}
              >
                <Callout onPress={() => props.onPressMarker(building)}>
                  <BodyText style={{ fontWeight: "400", fontSize: 17 }}>
                    {building.name}
                  </BodyText>
                </Callout>
              </Marker>
            ))}
        </MapView>
      )}
    </View>
  )
}
