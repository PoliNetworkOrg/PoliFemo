import { useNavigation } from "@react-navigation/native"
import { ConstructionType, Room } from "api/collections/rooms"
import { BodyText } from "components/Text"
import { RoomsSearchDataContext } from "contexts/rooms"
import { PermissionStatus } from "expo-location"
import { getDistance } from "geolib"
import { FC, useContext, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Platform, Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { getBuildingInfo, isRoomFree, ValidAcronym } from "utils/rooms"
import { EmptyListMessage } from "components/EmptyListMessage"
import { BuildingItem } from "./DefaultList"
import { FreeClassList } from "./FreeClassList"
import { Map } from "./Map"

interface PositionModalityProps {
  currentCoords: [number, number]
  locationStatus: PermissionStatus
}

enum ButtonType {
  MAP,
  LIST,
}

/**
 * This component handles the button's state and the two modalities: Map or List.
 * In addition it calls the API to find which rooms and buildings are available
 */
export const PositionModality: FC<PositionModalityProps> = props => {
  const { primary, isDark, palette } = usePalette()

  const [status, setStatus] = useState<ButtonType>(ButtonType.MAP)

  const { navigate } = useNavigation()

  const { rooms } = useContext(RoomsSearchDataContext)

  const acronyms: ValidAcronym[] = ["MIA", "MIB", "LCF", "CRG", "PCL", "MNI"]

  const { t } = useTranslation("freeClass")

  const allRooms = useMemo(
    () =>
      acronyms.reduce<Room[]>((allrooms, a) => {
        if (rooms[a]) {
          // this if-else is necessary now. backend must fix CRG acronym
          return [
            ...allrooms,
            ...rooms[a]
              .filter(r => {
                //filter the free rooms available now
                return isRoomFree(r, new Date(), true)
              })
              .map(room => {
                const currentBuilding = getBuildingInfo(a, room.building)
                return {
                  ...room,
                  latitude: currentBuilding?.latitude,
                  longitude: currentBuilding?.longitude,
                }
              }),
          ]
        } else {
          return [...allrooms]
        }
      }, []),
    [rooms]
  )

  const tempBuildingStrings: string[] = []
  const allBuildings = useMemo(() => {
    const buildings: BuildingItem[] = []

    for (const a of acronyms) {
      if (rooms[a]) {
        // this if is necessary now. backend must fix CRG acronym
        for (const room of rooms[a].filter(r => {
          //filter the free rooms available now
          return isRoomFree(r, new Date(), true)
        })) {
          const currentBuildingString = room.building + "-" + a
          const currentBuilding = getBuildingInfo(a, room.building)

          if (currentBuilding !== undefined) {
            const indexElement = tempBuildingStrings.indexOf(
              currentBuildingString
            )

            if (indexElement === -1) {
              // element not present
              const newBuilding: BuildingItem = {
                type: ConstructionType.BUILDING,
                campus: currentBuilding.campus,
                name: currentBuilding.name,
                latitude: currentBuilding.latitude,
                longitude: currentBuilding.longitude,
                freeRoomList: [room],
                allRoomList: [],
                fullName: room.building,
              }
              buildings.push(newBuilding)
              tempBuildingStrings.push(currentBuildingString)
            } else {
              buildings[indexElement].freeRoomList.push(room)
            }
          }
        }
      }
    }
    return buildings
  }, [rooms])

  return (
    <>
      <View
        style={{
          marginTop: 30,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Pressable
          style={{
            width: 134,
            height: 44,
            backgroundColor:
              status === ButtonType.MAP
                ? primary
                : isDark
                ? palette.primary
                : palette.lighter,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setStatus(ButtonType.MAP)}
        >
          <BodyText
            style={{
              fontWeight: status === ButtonType.MAP ? "900" : "500",
              color: "white",
            }}
          >
            {t("freeClass_map")}
          </BodyText>
        </Pressable>
        <Pressable
          style={{
            width: 134,
            height: 44,
            backgroundColor:
              status === ButtonType.LIST
                ? primary
                : isDark
                ? palette.primary
                : palette.lighter,
            borderRadius: 22,
            marginLeft: 18,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setStatus(ButtonType.LIST)}
        >
          <BodyText
            style={{
              fontWeight: status === ButtonType.LIST ? "900" : "500",
              color: "white",
            }}
          >
            {t("freeClass_list")}
          </BodyText>
        </Pressable>
      </View>
      {status === ButtonType.LIST ? (
        <View
          style={{
            flex: 1,
            marginTop: 23,
            marginBottom: Platform.OS === "ios" ? 105 : 93,
          }}
        >
          {allRooms ? (
            allRooms === undefined ? (
              <ActivityIndicator
                style={{ marginTop: 50, marginLeft: 3 }}
                size="large"
              />
            ) : (
              <FreeClassList
                data={allRooms
                  .sort(function (roomA, roomB) {
                    const currentCoords = {
                      latitude: props.currentCoords[0],
                      longitude: props.currentCoords[1],
                    }
                    if (
                      roomA.latitude &&
                      roomA.longitude &&
                      roomB.latitude &&
                      roomB.longitude
                    ) {
                      if (
                        getDistance(currentCoords, {
                          latitude: roomA.latitude,
                          longitude: roomA.longitude,
                        }) <
                        getDistance(currentCoords, {
                          latitude: roomB.latitude,
                          longitude: roomB.longitude,
                        })
                      ) {
                        return -1
                      } else if (
                        getDistance(currentCoords, {
                          latitude: roomA.latitude,
                          longitude: roomA.longitude,
                        }) >
                        getDistance(currentCoords, {
                          latitude: roomB.latitude,
                          longitude: roomB.longitude,
                        })
                      ) {
                        return 1
                      } else {
                        return 0
                      }
                    }
                    return 0
                  })
                  .slice(0, 30)}
                date={new Date()}
              />
            )
          ) : (
            <EmptyListMessage message={t("positionModalityEmptyList")} />
          )}
        </View>
      ) : (
        <Map
          userLatitude={props.currentCoords[0]}
          userLongitude={props.currentCoords[1]}
          locationStatus={props.locationStatus}
          buildingList={allBuildings}
          onPressMarker={(building: BuildingItem) => {
            navigate(
              "ClassChoice" as never,
              {
                building: building,
              } as never
            )
          }}
        />
      )}
    </>
  )
}
