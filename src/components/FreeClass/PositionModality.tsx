import { FC, useEffect, useState } from "react"
import { View, Pressable, ActivityIndicator } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { Map } from "./Map"
import { FreeClassList } from "./FreeClassList"
import { PermissionStatus } from "expo-location"
import { BuildingItem } from "pages/FreeClass/BuildingChoice"
import { ConstructionType, RoomSimplified } from "api/rooms"
import { useNavigation } from "@react-navigation/native"
import { PositionPicker } from "./PositionPicker"
import { CampusItem } from "pages/FreeClass/CampusChoice"
import buildingCoordsJSON from "components/FreeClass/buildingCoords.json"
import { HeadquarterItem } from "pages/FreeClass/HeadquarterChoice"
import { api } from "api"
import { addHours, getBuildingInfo, ValidAcronym } from "utils/rooms"

interface PositionModalityProps {
  currentCoords: number[]
  locationStatus: PermissionStatus
  headquarter: HeadquarterItem | undefined
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
  const [campusSearched, setCampusSearched] = useState<CampusItem>()

  const { primary, isDark, palette } = usePalette()

  const [status, setStatus] = useState<ButtonType>(ButtonType.MAP)

  const [roomList, setRoomList] = useState<RoomSimplified[]>()

  const [buildingList, setBuildingList] = useState<BuildingItem[]>()

  const { navigate } = useNavigation()

  const findCampusCoordinates = (campusName: string) => {
    const newCampusName = campusName.split(/ (.*)/, 2) //split name by first space(" ") occurence, es: Bovisa La Masa -> ["Bovisa","La Masa"]
    for (const h of buildingCoordsJSON) {
      for (const c of h.campus) {
        if (newCampusName.toString() === c.name.toString()) {
          setCampusSearched({
            type: ConstructionType.CAMPUS,
            name: c.name,
            acronym: h.acronym as ValidAcronym,
            latitude: c.latitude,
            longitude: c.longitude,
          })
          break
        }
      }
    }
  }

  const dateEnd = addHours(new Date(), 3)

  const findRoomsAvailable = async (headquarter: HeadquarterItem) => {
    //call the API
    try {
      const { data } = await api.rooms.getFreeRoomsTimeRange(
        headquarter.acronym,
        new Date().toISOString(),
        dateEnd.toISOString()
      )
      const response = data
      if (response.length > 0) {
        const tempBuildingStrings: string[] = []
        const tempBuildingList: BuildingItem[] = []
        const tempRoomList: RoomSimplified[] = []

        response.map(room => {
          const roomBuilding: string[] = room.building.split(" ")
          roomBuilding[0] += " "

          const currentBuildingString = room.building.replace(
            "Edificio ",
            "Ed. "
          )
          if (tempRoomList.length <= 100) {
            //dispaly the first 100 rooms
            tempRoomList.push({
              roomId: room.room_id,
              name: room.name,
              occupancies: room.occupancies,
              occupancyRate: room.occupancy_rate ?? undefined,
            })
          } else {
            setRoomList(tempRoomList)
          }

          if (props.headquarter?.campusList !== undefined) {
            if (!tempBuildingStrings.includes(currentBuildingString)) {
              const currentBuilding = getBuildingInfo(
                props.headquarter,
                room.building
              )
              if (currentBuilding !== undefined) {
                currentBuilding.freeRoomList = [
                  {
                    roomId: room.room_id,
                    name: room.name,
                    occupancies: room.occupancies,
                    occupancyRate: room.occupancy_rate ?? undefined,
                  },
                ]
                tempBuildingStrings.push(currentBuildingString)
                tempBuildingList.push(currentBuilding)
              }
            } else {
              //element already in the list
              const indexElement = tempBuildingStrings.indexOf(
                currentBuildingString
              )
              tempBuildingList[indexElement].freeRoomList.push({
                roomId: room.room_id,
                name: room.name,
                occupancies: room.occupancies,
                occupancyRate: room.occupancy_rate ?? undefined,
              })
            }
          }
        })
        setBuildingList(tempBuildingList)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (props.headquarter !== undefined) {
      void findRoomsAvailable(props.headquarter)
    }
  }, [props.headquarter])

  return (
    <>
      <View style={{ marginTop: -23 }}>
        <PositionPicker
          headquarter={props.headquarter}
          onPositionSelected={campusName => findCampusCoordinates(campusName)}
        />
      </View>
      <View
        style={{
          marginTop: 10,
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
          {roomList === undefined ? (
            <ActivityIndicator
              style={{ marginTop: 50, marginLeft: 3 }}
              size="large"
            />
          ) : (
            <FreeClassList data={roomList} date={new Date()} />
          )}
        </View>
      ) : (
        <Map
          userLatitude={props.currentCoords[0]}
          userLongitude={props.currentCoords[1]}
          locationStatus={props.locationStatus}
          buildingList={buildingList}
          campusSearched={campusSearched}
          onPressMarker={(building: BuildingItem) =>
            navigate(
              "ClassChoice" as never,
              {
                building: building,
                currentDate: new Date().toString(),
              } as never
            )
          }
        />
      )}
    </>
  )
}
