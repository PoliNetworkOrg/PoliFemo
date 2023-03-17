import { FC, useContext, useEffect, useState } from "react"
import { View, Pressable, ActivityIndicator } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { Map } from "./Map"
import { FreeClassList } from "./FreeClassList"
import { PermissionStatus } from "expo-location"
import { BuildingItem, HeadquarterItem } from "./DefaultList"
import { ConstructionType, Room } from "api/rooms"
import { useNavigation } from "@react-navigation/native"
import { getBuildingInfo, ValidAcronym } from "utils/rooms"
import { ErrorMessage } from "../ErrorMessage"
import { RoomsSearchDataContext } from "contexts/rooms"
import { getDistance } from "geolib"

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

  const [allRooms, setAllRooms] = useState<Room[]>()

  const [buildingList, setBuildingList] = useState<BuildingItem[]>()

  const { navigate } = useNavigation()

  const { rooms } = useContext(RoomsSearchDataContext)

  const extractAllRoomsAndBuildings = () => {
    const acronyms: ValidAcronym[] = ["MIA", "MIB", "LCF", "CRG", "PCL", "MNI"]

    const tempRooms: Room[] = []
    const tempBuildingStrings: string[] = []
    const tempBuildingList: BuildingItem[] = []

    acronyms.map(a => {
      const currentHeadquarter: HeadquarterItem = {
        type: ConstructionType.HEADQUARTER,
        acronym: a,
        name: [a],
        campusList: [],
      }

      rooms[a].rooms.map(room => {
        const currentBuildingString: string = room.building + "-" + a //es Edificio 1-MIA

        if (currentHeadquarter?.campusList !== undefined) {
          const currentBuilding = getBuildingInfo(
            currentHeadquarter,
            room.building
          )
          if (!tempBuildingStrings.includes(currentBuildingString)) {
            if (currentBuilding !== undefined) {
              currentBuilding.freeRoomList = [room]
              currentBuilding.fullName = room.building
              tempBuildingStrings.push(currentBuildingString)
              tempBuildingList.push(currentBuilding)
            }
          } else {
            //element already in the list
            const indexElement = tempBuildingStrings.indexOf(
              currentBuildingString
            )
            tempBuildingList[indexElement].freeRoomList.push(room)
          }
          if (tempRooms.length < 50) {
            tempRooms.push({
              ...room,
              latitude: currentBuilding?.latitude,
              longitude: currentBuilding?.longitude,
            }) //add room
          }
        }
      })
    })
    setAllRooms(tempRooms)
    setBuildingList(tempBuildingList)
  }

  useEffect(() => extractAllRoomsAndBuildings(), [])

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
            Mappa
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
            Lista
          </BodyText>
        </Pressable>
      </View>
      {status === ButtonType.LIST ? (
        <View
          style={{
            flex: 1,
            marginBottom: 93,
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
                data={allRooms.sort(function (roomA, roomB) {
                  const currentCoords = {
                    latitude: 45.477501115168685,
                    longitude: 9.234919419524664,
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
                })}
                date={new Date()}
              />
            )
          ) : (
            <ErrorMessage
              message="Non ci sono aule libere nelle vicinanze"
              styleView={{ marginTop: 100, marginHorizontal: 20 }}
              styleMessage={{
                alignSelf: "center",
                color: "red",
                fontWeight: "400",
                fontSize: 30,
                textAlign: "center",
              }}
            />
          )}
        </View>
      ) : (
        <Map
          userLatitude={props.currentCoords[0]}
          userLongitude={props.currentCoords[1]}
          locationStatus={props.locationStatus}
          buildingList={buildingList}
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
