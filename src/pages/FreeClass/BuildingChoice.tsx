import { MainStackScreen } from "navigation/NavigationTypes"
import { useState, useEffect, useContext } from "react"
import { ActivityIndicator, View } from "react-native"
import { Title } from "components/Text"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { PageWrapper } from "components/Groups/PageWrapper"
import { ConstructionType } from "api/rooms"
import { BuildingItem, DefaultList } from "components/FreeClass/DefaultList"
import { formatBuildingName, isCampusCorrect, isRoomFree } from "utils/rooms"

import { RoomsSearchDataContext } from "contexts/rooms"
import { ErrorMessage } from "components/ErrorMessage"

/**
 * In this page the user can select the building.
 */
export const BuildingChoice: MainStackScreen<"BuildingChoice"> = props => {
  const { campus } = props.route.params

  const [buildingList, setBuildingList] = useState<BuildingItem[]>([])

  const [error, setError] = useState<boolean>(false)

  const { rooms, date, setDate, isRoomsSearching } = useContext(
    RoomsSearchDataContext
  )

  const findAvailableBuildings = () => {
    try {
      const currRooms = rooms[campus.acronym].rooms
      if (currRooms.length > 0) {
        const tempBuildingStrings: string[] = []
        const tempBuildings: BuildingItem[] = []
        currRooms
          .filter(room => {
            return isCampusCorrect(campus, room) && isRoomFree(room, date)
          })
          .map(room => {
            const currentBuildingString = room.building
              .replace("Edificio ", "Ed. ")
              .replace("Padiglione ", "Pad. ")
              .replace("Palazzina ", "Pal. ")
            if (!tempBuildingStrings.includes(currentBuildingString)) {
              const currentBuilding: BuildingItem = {
                type: ConstructionType.BUILDING,
                name: formatBuildingName(room.building),
                campus: campus,
                freeRoomList: [], //not used
                allRoomList: [], // not used
                fullName: room.building,
              }
              tempBuildingStrings.push(currentBuildingString)
              tempBuildings.push(currentBuilding)
            }
          })
        // populate all rooms list
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
    void findAvailableBuildings()
  }, [rooms[campus.acronym].rooms])

  return (
    <PageWrapper>
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
      {error || (!isRoomsSearching && buildingList.length === 0) ? (
        <ErrorMessage
          message="Non ci sono edifici disponibili"
          styleView={{ marginTop: 100, marginHorizontal: 20 }}
          styleMessage={{
            alignSelf: "center",
            color: "red",
            fontWeight: "400",
            fontSize: 30,
            textAlign: "center",
          }}
        />
      ) : !isRoomsSearching && buildingList ? (
        <DefaultList dataToShow={buildingList} />
      ) : (
        <ActivityIndicator size={"large"} style={{ marginTop: 100 }} />
      )}
    </PageWrapper>
  )
}
