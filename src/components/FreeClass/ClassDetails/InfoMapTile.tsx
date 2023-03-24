import { FC } from "react"
import { Linking, Platform, Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText, Text } from "components/Text"
import { extractBuilding, extractRoom } from "utils/rooms"
import MapView from "react-native-maps"
import expand from "assets/freeClassrooms/expand.svg"
import { Icon } from "components/Icon"
import { AdaptiveShadowView } from "components/BoxShadow"

interface InfoMapTileProps {
  roomName: string
  building: string
  address?: string
  capacity?: number
  longitude?: number
  latitude?: number
}

export const InfoMapTile: FC<InfoMapTileProps> = props => {
  const { labelsHighContrast, isLight, palette, primary } = usePalette()

  const building = extractBuilding(props.building)
  const roomName = extractRoom(props.roomName)

  const latitude = props.latitude
  const longitude = props.longitude

  /*from  https://stackoverflow.com/questions/73653813/how-to-open-google-map-with-latitude-and-longitude*/
  const openAddressOnMap = (label: string, lat: string, lng: string) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    })
    const latLng = `${lat},${lng}`
    if (scheme) {
      const url = Platform.select({
        ios: `${scheme}${label.replace(" ", "%20")}@${latLng}`,
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
          <Text>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "300",
                color: isLight ? palette.variant1 : primary,
              }}
            >
              {building && roomName ? `${building}.` : undefined}
            </Text>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "900",
                color: isLight ? palette.variant1 : primary,
              }}
            >
              {building && roomName ? roomName : props.roomName}
            </Text>
          </Text>
        </View>
        <View style={{ marginTop: 14, marginBottom: 8, flex: 1 }}>
          <BodyText
            style={{
              fontSize: 16,
              fontWeight: "900",
              color: labelsHighContrast,
            }}
          >
            Indirizzo :
          </BodyText>
          <BodyText
            style={{
              fontSize: 13,
              fontWeight: "400",
              color: labelsHighContrast,
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
              color: labelsHighContrast,
              flex: 1,
            }}
          >
            Capienza:{" "}
          </BodyText>
          <BodyText
            style={{
              fontSize: 13,
              fontWeight: "400",
              color: labelsHighContrast,
            }}
          >
            {props.capacity}
          </BodyText>
        </View>
      </View>
      {latitude && longitude && (
        <View
          style={{
            alignItems: "flex-end",
            height: "100%",
          }}
        >
          <Pressable
            style={{
              alignItems: "flex-end",
              marginTop: 65,
            }}
            onPress={() =>
              openAddressOnMap(
                props.building,
                latitude.toString(),
                longitude.toString()
              )
            }
          >
            <AdaptiveShadowView
              style={{ width: 100, height: 100 }}
              shadow={{
                color: "#000",
                offset: {
                  y: 4,
                },
                opacity: 0.25,
                blur: 4,
              }}
              contentContainerStyle={{
                flex: 1,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  height: 100,
                  width: 100,
                }}
              >
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
                  <Icon source={expand} />
                </View>
                <MapView
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: -25,
                  }}
                  initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomTapEnabled={false}
                  zoomControlEnabled={false}
                  zoomEnabled={false}
                  onPress={() =>
                    openAddressOnMap(
                      props.building,
                      latitude.toString(),
                      longitude.toString()
                    )
                  }
                />
              </View>
            </AdaptiveShadowView>
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
                  color: labelsHighContrast,
                }}
              >
                consulta la{" "}
              </BodyText>
              <BodyText
                style={{
                  fontSize: 16,
                  fontWeight: "900",
                  color: labelsHighContrast,
                }}
              >
                mappa
              </BodyText>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  )
}
