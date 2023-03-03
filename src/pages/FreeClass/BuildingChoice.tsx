import { MainStackScreen } from "navigation/NavigationTypes"
import React, { useState, useEffect, useContext } from "react"
import { ActivityIndicator, View } from "react-native"
import { Title, BodyText } from "components/Text"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { CampusItem } from "./CampusChoice"
import { PageWrapper } from "components/Groups/PageWrapper"
import { Room, RoomSimplified } from "api/rooms"
import { ConstructionType } from "api/rooms"
import { DefaultList } from "components/FreeClass/DefaultList"
import { formatBuildingName, isRoomFree } from "utils/rooms"
import buildingCoordsJSON from "components/FreeClass/buildingCoords.json"
import { RoomsSearchDataContext } from "contexts/rooms"

export interface BuildingItem {
  type: ConstructionType
  campus: CampusItem
  name: string[]
  latitude?: number
  longitude?: number
  freeRoomList: RoomSimplified[]
  allRoomList: RoomSimplified[]
}

/**
 * In this page the user can select the building.
 */
export const BuildingChoice: MainStackScreen<"BuildingChoice"> = props => {
  const { campus } = props.route.params

  const [buildingList, setBuildingList] = useState<BuildingItem[]>()

  const [error, setError] = useState<boolean>(false)

  const { rooms, date, setDate } = useContext(RoomsSearchDataContext)

  const findCorrectCampus = (campus: CampusItem, room: Room) => {
    for (const h of buildingCoordsJSON) {
      if (h.acronym === campus.acronym) {
        for (const c of h.campus) {
          if (c.name.toString() === campus.name.toString()) {
            for (const b of c.buildings) {
              if (room.building === b.name) {
                return true
              }
            }
          }
        }
      }
    }
    return false
  }

  //filter rooms
  const findRoomsAvailable = () => {
    console.log("searching room buildings")
    try {
      const currRooms = rooms[campus.acronym].rooms
      if (currRooms.length > 0) {
        const tempBuildingStrings: string[] = []
        const tempBuildings: BuildingItem[] = []
        currRooms
          .filter(room => {
            return findCorrectCampus(campus, room) && isRoomFree(room, date)
          })
          .map(room => {
            const currentBuildingString = room.building
              .replace("Edificio ", "Ed. ")
              .replace("Padiglione ", "Pad. ")
              .replace("Palazzina ", "Pal. ")
            if (!tempBuildingStrings.includes(currentBuildingString)) {
              const currentBuilding: BuildingItem = {
                type: ConstructionType.BUILDING,
                campus: campus,
                name: formatBuildingName(room.building),
                freeRoomList: [
                  {
                    roomId: room.room_id,
                    name: room.name,
                    occupancies: room.occupancies,
                    occupancyRate: room.occupancy_rate ?? undefined,
                  },
                ],
                allRoomList: [],
              }
              tempBuildingStrings.push(currentBuildingString)
              tempBuildings.push(currentBuilding)
            } else {
              //element already present in the list
              const indexElement = tempBuildingStrings.indexOf(
                currentBuildingString
              )
              tempBuildings[indexElement].freeRoomList.push({
                roomId: room.room_id,
                name: room.name,
                occupancies: room.occupancies,
                occupancyRate: room.occupancy_rate ?? undefined,
              })
            }
          })
        // populate all rooms list
        currRooms
          .filter(room => findCorrectCampus(campus, room))
          .map(room => {
            const currentBuildingString = room.building
              .replace("Edificio ", "Ed. ")
              .replace("Padiglione ", "Pad. ")
              .replace("Palazzina ", "Pal. ")
            if (tempBuildingStrings.includes(currentBuildingString)) {
              const indexElement = tempBuildingStrings.indexOf(
                currentBuildingString
              )
              tempBuildings[indexElement].allRoomList.push({
                roomId: room.room_id,
                name: room.name,
                occupancies: room.occupancies,
                occupancyRate: room.occupancy_rate ?? undefined,
              })
            }
          })
        setBuildingList(tempBuildings)
        setError(false)
      } else {
        setBuildingList([])
      }
    } catch (error) {
      setError(true)
      console.log(error)
    }
  }

  useEffect(() => {
    void findRoomsAvailable()
  }, [rooms[campus.acronym], date])

  return (
    <PageWrapper style={{ marginTop: 106 }}>
      <View style={{ paddingTop: 28 }}>
        {campus.name.length > 1 ? (
          <Title
            style={{
              paddingLeft: 28,
              fontWeight: "300",
              fontFamily: "Roboto_300Light",
            }}
          >
            {campus.name[0]}
            <Title>{" " + campus.name[1]}</Title>
          </Title>
        ) : (
          <Title style={{ paddingLeft: 28 }}>{campus.name}</Title>
        )}
        <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      </View>
      {error || buildingList?.length == 0 ? (
        <BodyText
          style={{
            alignSelf: "center",
            marginTop: 100,
            color: "red",
            fontWeight: "700",
            fontSize: 30,
            textAlign: "center",
          }}
        >
          Non ci sono edifici disponibili
        </BodyText>
      ) : buildingList !== undefined ? (
        <DefaultList dataToShow={buildingList} />
      ) : (
        <ActivityIndicator size={"large"} style={{ marginTop: 100 }} />
      )}
    </PageWrapper>
  )
}
