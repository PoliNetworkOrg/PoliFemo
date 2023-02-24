import { MainStackScreen } from "navigation/NavigationTypes"
import React, { useState, useEffect } from "react"
import { View } from "react-native"
import { Title, BodyText } from "components/Text"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { api, RetryType } from "api"
import { CampusItem } from "./CampusChoice"
import { PageWrapper } from "components/Groups/PageWrapper"
import { addHours, RoomSimplified } from "api/rooms"
import { ConstructionType } from "api/rooms"
import { DefaultList } from "components/FreeClass/DefaultList"
import { formatBuildingName } from "utils/rooms"

export interface BuildingItem {
  type: ConstructionType
  campus: CampusItem
  name: string[]
  latitude?: number
  longitude?: number
  freeRoomList: RoomSimplified[]
}

/**
 * In this page the user can select the building.
 */
export const BuildingChoice: MainStackScreen<"BuildingChoice"> = props => {
  const { campus, currentDate } = props.route.params

  const [buildingList, setBuildingList] = useState<BuildingItem[]>()

  const [error, setError] = useState<boolean>(false)

  //non-ISO format for simplicity (local timezone) and
  // compatibility with `handleConfirm` function
  const [date, setDate] = useState<Date>(
    new Date(currentDate) !== new Date() ? new Date(currentDate) : new Date()
  )

  //the dateEnd is the startDate + 3 hours, the number of hours has not been chosen yet
  const dateEnd = addHours(date, 3).toISOString() //3 hours is an example

  //main function that handles the call to the API in order to obtain the list of freeclassRooms
  const findRoomsAvailable = async () => {
    try {
      const response = await api.rooms.getFreeRoomsTimeRange(
        campus.acronym,
        date.toISOString(),
        dateEnd,
        { maxRetries: 1, retryType: RetryType.RETRY_N_TIMES }
      )
      if (response.length > 0) {
        const tempBuildingStrings: string[] = []
        const tempBuildings: BuildingItem[] = []
        response.map(room => {
          const currentBuildingString = room.building.replace(
            "Edificio ",
            "Ed. "
          )
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
        setBuildingList(tempBuildings)
      }
    } catch (error) {
      setError(true)
      console.log(error)
    }
  }

  useEffect(() => {
    void findRoomsAvailable()
  }, [date])

  useEffect(() => {
    setDate(new Date(currentDate))
  }, [props.route.params.currentDate])

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
      {error ? (
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
        <DefaultList dataToShow={buildingList} currentDate={date} />
      ) : undefined}
    </PageWrapper>
  )
}
