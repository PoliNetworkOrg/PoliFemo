import { MainStackScreen } from "navigation/NavigationTypes"
import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Platform, View } from "react-native"
import { FreeClassList } from "components/FreeClass/FreeClassList"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { getBuildingCoords, isRoomFree } from "utils/rooms"
import { RoomsSearchDataContext } from "contexts/rooms"
import { Room } from "api/collections/rooms"
import { EmptyListMessage } from "components/EmptyListMessage"
import { useTranslation } from "react-i18next"
import { PageWrap } from "components/PageLayout"

/**
 * In this page the user can select finally the free class he wants.
 */
export const ClassChoice: MainStackScreen<"ClassChoice"> = props => {
  const { building } = props.route.params

  const { date, setDate, rooms, isRoomsSearching } = useContext(
    RoomsSearchDataContext,
  )

  const coords = getBuildingCoords(building.campus, building.fullName)

  const [buildingRooms, setBuildingRooms] = useState<Room[]>([])

  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])

  //update rooms from which to apply date filters
  useEffect(() => {
    const newBuildingRooms = rooms[building.campus.acronym].filter(room => {
      return building.fullName === room.building
    })
    setBuildingRooms(newBuildingRooms)
  }, [rooms])

  //apply date and toggle filters
  useEffect(() => {
    const newFilteredRooms = buildingRooms.filter(room => {
      return isRoomFree(room, date, true)
    })
    setFilteredRooms(newFilteredRooms ?? [])
  }, [buildingRooms, date])

  const { t } = useTranslation("freeClass")

  return (
    <PageWrap
      title={
        building.fullName
          ? [building.fullName.split(" ")[0], building.name[1]]
          : building.name
      }
    >
      <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      <View
        style={{
          flex: 1,
          marginTop: 35,
          marginBottom: Platform.OS === "ios" ? 105 : 93,
        }}
      >
        {filteredRooms?.length === 0 && !isRoomsSearching ? (
          <EmptyListMessage message={t("classChoiceEmptyList")} />
        ) : !isRoomsSearching && filteredRooms.length > 0 ? (
          <FreeClassList
            data={filteredRooms}
            date={date}
            latitude={coords?.latitude}
            longitude={coords?.longitude}
          />
        ) : (
          <ActivityIndicator size={"large"} style={{ marginTop: 100 }} />
        )}
      </View>
    </PageWrap>
  )
}
