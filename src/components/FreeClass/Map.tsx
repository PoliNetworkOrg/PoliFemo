import { FC, useContext, useEffect, useRef, useState } from "react"
import { View, ActivityIndicator, Platform, Pressable } from "react-native"
import MapView, { Callout, Marker, Region } from "react-native-maps"
import { PermissionStatus } from "expo-location"
import { BodyText } from "components/Text"
import { BuildingItem } from "./DefaultList"
import { Icon } from "components/Icon"
import iconMaps from "assets/freeClassrooms/iconMaps.svg"
import { ErrorMessage } from "components/ErrorMessage"
import { useTranslation } from "react-i18next"
import { RoomsSearchDataContext } from "contexts/rooms"

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
  const [error, setError] = useState<boolean>(false)

  const { currentRegionMap, setCurrentRegionMap } = useContext(
    RoomsSearchDataContext
  )

  const [region, setRegion] = useState<Region>({
    latitude: props.userLatitude,
    longitude: props.userLongitude,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  })

  const map = useRef<MapView>(null)

  //initialize timer
  let timer: NodeJS.Timeout

  useEffect(() => {
    if (props.userLatitude === 0 && props.userLongitude === 0) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        setError(true)
      }, 10000) //after 10 sec I set the timer to true and I display an error.
    } else {
      clearTimeout(timer)

      if (currentRegionMap.latitude !== 0 && currentRegionMap.longitude !== 0) {
        //set region saved in the context
        setRegion(currentRegionMap)
      } else {
        //set current region
        setRegion({
          latitude: props.userLatitude,
          longitude: props.userLongitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        })
      }
    }
  }, [props.userLatitude])

  const { t } = useTranslation("freeClass")

  return (
    <View
      style={{
        marginBottom: 100,
        paddingBottom: 130,
      }}
    >
      {props.userLatitude === 0 || props.userLongitude === 0 ? (
        props.locationStatus !== PermissionStatus.GRANTED || error === true ? (
          <ErrorMessage message={t("mapError")} />
        ) : (
          <ActivityIndicator
            style={{ marginTop: 50, marginLeft: 3 }}
            size="large"
          />
        )
      ) : (
        <MapView
          ref={map}
          style={{ marginTop: 23, width: "100%", height: "100%" }}
          region={region}
          onRegionChangeComplete={region => {
            setCurrentRegionMap(region)
          }}
          showsUserLocation={true}
          mapPadding={{
            top: 0,
            right: 0,
            bottom: Platform.OS === "ios" ? 120 : 115,
            left: 0,
          }}
        >
          {Platform.OS === "ios" ? (
            <Pressable
              //this pressable is a button to return to user current location, on MapKit this feature is not provided by react-native-maps
              style={{
                position: "absolute",
                bottom: 150,
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
                onSelect={() => {
                  if (map.current !== null) {
                    map.current.animateToRegion(
                      {
                        latitude: building.latitude ?? 0,
                        longitude: building.longitude ?? 0,
                        latitudeDelta: 0.002,
                        longitudeDelta: 0.002,
                      },
                      1000
                    )
                  }
                }}
              >
                <Callout onPress={() => props.onPressMarker(building)}>
                  <BodyText style={{ fontWeight: "400", fontSize: 17 }}>
                    {building.fullName}
                  </BodyText>
                </Callout>
              </Marker>
            ))}
        </MapView>
      )}
    </View>
  )
}
