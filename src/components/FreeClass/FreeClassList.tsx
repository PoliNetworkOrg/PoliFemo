import { BodyText } from "components/Text"
import { FC } from "react"
import { View, Pressable, Dimensions } from "react-native"
import { usePalette } from "utils/colors"
import timerIcon from "assets/freeClassrooms/timer.svg"
import overcrowdingIcon from "assets/freeClassrooms/overcrowding.svg"
import fireIcon from "assets/freeClassrooms/fire.svg"
import { useNavigation } from "navigation/NavigationTypes"
import { FlatList } from "react-native-gesture-handler"
import { Occupancies, RoomSimplified } from "api/rooms"
import { extractTimeLeft, getStartEndDate } from "utils/rooms"
import { Icon } from "components/Icon"

const { width } = Dimensions.get("window")

interface FreeClassListProps {
  data: RoomSimplified[] | undefined
  date: Date
  latitude?: number
  longitude?: number
}

enum OvercrowdingTypes {
  POCO = "Poco",
  MEDIAMENTE = "Mediamente",
  MOLTO = "Molto",
}

/**
 * It handles a list of freeclassrooms available.
 */
export const FreeClassList: FC<FreeClassListProps> = props => {
  const { palette, labelsHighContrast } = usePalette()
  const { navigate } = useNavigation()

  const overcrowdingFunction = (occupancyRate: number | undefined) => {
    if (
      occupancyRate === undefined ||
      (occupancyRate >= 1 && occupancyRate < 2.33)
    ) {
      return OvercrowdingTypes.POCO
    } else if (occupancyRate >= 2.33 && occupancyRate < 3.66) {
      return OvercrowdingTypes.MEDIAMENTE
    } else {
      return OvercrowdingTypes.MOLTO
    }
  }

  let hLeft: string | undefined
  let mLeft: string | undefined
  const findTimeLeft = (occupancies: Occupancies) => {
    const searchDate = new Date(props.date)
    const { startDate, endDate } = getStartEndDate(searchDate, occupancies)
    const { hoursLeft, minutesLeft } = extractTimeLeft(startDate, endDate)
    hLeft = hoursLeft
    mLeft = minutesLeft
  }

  return (
    <FlatList
      showsVerticalScrollIndicator={true}
      style={{
        flex: 1,
        marginTop: 27,
      }}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
      }}
      data={props.data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <Pressable
          style={{
            width: width - 65,
            height: 93,
            backgroundColor: "#8791BD",
            marginBottom: 34,
            borderRadius: 16,
          }}
          onPress={() => {
            try {
              navigate("RoomDetails", {
                startDate: props.date.toISOString(),
                roomId: item.roomId,
                roomLatitude: props.latitude,
                roomLongitude: props.longitude,
                occupancies: item.occupancies,
                occupancyRate: item.occupancyRate,
              })
            } catch (err) {
              console.log(err)
            }
          }}
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
                paddingLeft: 100,
              }}
            >
              Libera per{"\n"}
              <BodyText
                style={{
                  fontWeight: "700",
                  fontSize: 14,
                  color: hLeft !== "0" ? labelsHighContrast : palette.accent,
                }}
              >
                {void findTimeLeft(item.occupancies)}
                {hLeft && mLeft ? `${hLeft} h ${mLeft} '` : "-- h -- '"}
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
                {overcrowdingFunction(item.occupancyRate)}
                {"\n"}
                <BodyText
                  style={{
                    fontWeight: "300",
                    fontSize: 12,
                    color: "#414867",
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
              {item.occupancyRate !== undefined &&
              item.occupancyRate >= 3.66 ? (
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
          <View
            style={{
              position: "absolute",
              backgroundColor: palette.primary,
              width: "40%",
              height: 93,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            }}
          >
            <BodyText
              style={{
                fontWeight: "700",
                color: "white",
                fontSize: 24,
              }}
            >
              {item.name}
            </BodyText>
          </View>
        </Pressable>
      )}
    />
  )
}
