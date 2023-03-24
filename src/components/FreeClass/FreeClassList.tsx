import { BodyText } from "components/Text"
import { FC } from "react"
import { View, Pressable, Dimensions } from "react-native"
import { usePalette } from "utils/colors"
import timerIcon from "assets/freeClassrooms/timer.svg"
import overcrowdingIcon from "assets/freeClassrooms/overcrowding.svg"
import fireIcon from "assets/freeClassrooms/fire.svg"
import { useNavigation } from "navigation/NavigationTypes"
import { FlatList } from "react-native-gesture-handler"
import { Room } from "api/rooms"
import { getStartEndDate } from "utils/rooms"
import { Icon } from "components/Icon"
import { AdaptiveShadowView } from "components/BoxShadow"

const { width } = Dimensions.get("window")

interface FreeClassListProps {
  data: Room[] | undefined
  date: Date
  latitude?: number
  longitude?: number
}

/**
 * It handles a list of freeclassrooms available.
 */
export const FreeClassList: FC<FreeClassListProps> = props => {
  const { palette, labelsHighContrast } = usePalette()
  const { navigate } = useNavigation()

  const limInf = 0
  const limSup = 5
  const range = (limSup - limInf) / 3
  const overcrowdingFunction = (occupancyRate: number | undefined) => {
    if (
      occupancyRate === undefined ||
      (occupancyRate >= limInf && occupancyRate < range)
    ) {
      return "Poco"
    } else if (occupancyRate >= range && occupancyRate < 2 * range) {
      return "Mediamente"
    } else {
      return "Molto"
    }
  }

  const formatRoomName = (roomName: string) => {
    return roomName.replace(" - ", "\n").replace("�", "")
  }

  return (
    <FlatList
      showsVerticalScrollIndicator={true}
      style={{
        flex: 1,
        paddingTop: 18,
      }}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
      }}
      data={props.data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => {
        const { endDate } = getStartEndDate(props.date, item.occupancies)

        const endhour =
          endDate?.getHours().toString().padStart(2, "0") ?? undefined
        const endMinutes =
          endDate?.getMinutes().toString().padStart(2, "0") ?? undefined

        const hoursLeft = endDate
          ? endDate?.getHours() - props.date.getHours()
          : 0

        const navigateToRoom = () => {
          try {
            navigate("RoomDetails", {
              startDate: props.date.toISOString(),
              roomId: item.room_id,
              roomLatitude: props.latitude ?? item.latitude,
              roomLongitude: props.longitude ?? item.longitude,
              occupancies: item.occupancies,
              occupancyRate: item.occupancy_rate,
            })
          } catch (err) {
            console.log(err)
          }
        }

        const roomName = formatRoomName(item.name)

        return (
          <Pressable
            style={{
              width: width - 65,
              height: 93,
              backgroundColor: palette.lighter,
              marginBottom: 34,
              borderRadius: 16,
            }}
            onPress={navigateToRoom}
          >
            <View
              style={{
                flexDirection: "row",
                width: width - 65,
                alignSelf: "center",
                marginTop: 12,
                justifyContent: "center",
              }}
            >
              <Icon source={timerIcon} />
              <BodyText
                style={{
                  position: "absolute",
                  fontWeight: "300",
                  fontSize: 12,
                  color: "white",
                  textAlign: "left",
                  paddingLeft: 130,
                }}
              >
                Libera fino alle{"\n"}
                <BodyText
                  style={{
                    fontWeight: "700",
                    fontSize: 14,
                    color: hoursLeft <= 1 ? palette.accent : labelsHighContrast,
                  }}
                >
                  {endhour && endMinutes
                    ? `${endhour}.${endMinutes}`
                    : "-- : --"}
                </BodyText>
              </BodyText>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                width: width - 65,
                justifyContent: "flex-end",
                marginTop: 10,
              }}
            >
              <View>
                <BodyText
                  style={{
                    fontWeight: "500",
                    fontSize: 12,
                    color: "#424967",
                    textAlign: "right",
                  }}
                >
                  {overcrowdingFunction(item.occupancy_rate ?? 0)}
                  {"\n"}
                  <BodyText
                    style={{
                      fontWeight: "300",
                      fontSize: 12,
                      color: palette.variant1,
                    }}
                  >
                    affollato
                  </BodyText>
                </BodyText>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Icon
                  scale={1.2}
                  style={{
                    marginTop: 4,
                    zIndex: 1,
                    height: 50,
                    marginRight: 10,
                  }}
                  source={overcrowdingIcon}
                />
                {item.occupancy_rate && item.occupancy_rate >= 2 * range ? (
                  <Icon
                    scale={1.1}
                    style={{
                      zIndex: 0,
                      position: "absolute",
                      marginTop: -12,
                      marginLeft: -2,
                    }}
                    source={fireIcon}
                  />
                ) : undefined}
              </View>
            </View>
            <AdaptiveShadowView
              style={{
                position: "absolute",
                width: "40%",
                borderRadius: 12,
              }}
              shadow={{
                offset: { y: 4 },
                color: "#000",
                opacity: 0.25,
                blur: 4,
              }}
              contentContainerStyle={{
                borderRadius: 12,
              }}
              onPress={navigateToRoom}
            >
              <View
                style={{
                  height: 93,
                  backgroundColor: palette.primary,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                }}
              >
                <BodyText
                  style={{
                    fontWeight: "700",
                    color: "white",
                    fontSize: roomName.length <= 15 ? 24 : 18,
                    textAlign: "center",
                  }}
                >
                  {roomName}
                </BodyText>
              </View>
            </AdaptiveShadowView>
          </Pressable>
        )
      }}
    />
  )
}
