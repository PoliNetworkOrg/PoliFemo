import React, { FC } from "react"
import { Linking, Platform, Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText, Text } from "components/Text"
import { extractBuilding, extractRoom } from "utils/rooms"
import MapView from "react-native-maps"
import expand from "assets/freeClassrooms/expand.svg"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"

interface InfoMapTileProps {
  roomName: string
  building: string
  address?: string
  capacity?: string
}

export const InfoMapTile: FC<InfoMapTileProps> = props => {
  const { isLight, primary } = usePalette()

  console.log(props.building)
  const building = extractBuilding(props.building)
  console.log(props.roomName)
  const roomName = extractRoom(props.roomName)

  const expandSvg = useSVG(expand)

  /*from  https://stackoverflow.com/questions/73653813/how-to-open-google-map-with-latitude-and-longitude*/
  const openAddressOnMap = (label: string, lat: string, lng: string) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    })
    const latLng = `${lat},${lng}`
    if (scheme) {
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      })
      if (url) {
        void Linking.openURL(url)
      }
    }
  }
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "column", flex: 1 }}>
        <View
          style={{
            marginTop: 28,
            flexDirection: "row",
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 40,
              fontWeight: "300",
              color: isLight ? "#414867" : primary,
            }}
          >
            {building && roomName ? `${building}.` : undefined}
          </Text>
          <Text
            style={{
              fontSize: 40,
              fontWeight: "900",
              color: isLight ? "#414867" : primary,
            }}
          >
            {building && roomName ? roomName : props.roomName}
          </Text>
        </View>
        <View style={{ marginTop: 14, marginBottom: 8, flex: 1 }}>
          <BodyText
            style={{
              fontSize: 16,
              fontWeight: "900",
              color: isLight ? "#414867" : "#fff",
            }}
          >
            Indirizzo :
          </BodyText>
          <BodyText
            style={{
              fontSize: 13,
              fontWeight: "400",
              color: isLight ? "#414867" : "#fff",
            }}
          >
            {props.address}
          </BodyText>
        </View>
        <View>
          <BodyText
            style={{
              fontSize: 16,
              fontWeight: "900",
              color: isLight ? "#414867" : "#fff",
              flex: 1,
            }}
          >
            Capienza:{" "}
          </BodyText>
          <BodyText
            style={{
              fontSize: 13,
              fontWeight: "400",
              color: isLight ? "#414867" : "#fff",
            }}
          >
            {props.capacity}
          </BodyText>
        </View>
      </View>
      <View
        style={{
          alignItems: "flex-end",
          height: "100%",
        }}
      >
        <View style={{ marginTop: 65 }}>
          <Pressable
            style={{
              alignItems: "flex-end",
            }}
            onPress={() =>
              openAddressOnMap(
                props.building ? building + "." + roomName : roomName,
                "45.478053",
                "9.228061"
              )
            }
          >
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: isLight ? "#414867" : "#fff",
                borderRadius: 10,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.43,
                shadowRadius: 9.51,

                elevation: 15,
              }}
            >
              {expand && expandSvg && (
                <View
                  style={{
                    position: "absolute",
                    width: 20,
                    height: 20,
                    bottom: 8,
                    right: 8,
                    zIndex: 2,
                  }}
                >
                  <Canvas
                    style={{
                      flex: 1,
                      width: 20,
                      height: 20,
                    }}
                  >
                    <ImageSVG
                      svg={expandSvg}
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                    />
                  </Canvas>
                </View>
              )}
              <MapView
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: -25,
                }}
                initialRegion={{
                  latitude: 45.478053,
                  longitude: 9.228061,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomTapEnabled={false}
                zoomControlEnabled={false}
                zoomEnabled={false}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
              }}
            >
              <BodyText
                style={{
                  fontSize: 13,
                  fontWeight: "400",
                  color: isLight ? "#414867" : "#fff",
                }}
              >
                consulta la{" "}
              </BodyText>
              <BodyText
                style={{
                  fontSize: 16,
                  fontWeight: "900",
                  color: isLight ? "#414867" : "#fff",
                }}
              >
                mappa
              </BodyText>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
