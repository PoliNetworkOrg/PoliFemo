import { MainStackScreen } from "navigation/NavigationTypes"
import { useEffect, useState } from "react"
import { InfoMapTile } from "components/FreeClass/ClassDetails/InfoMapTile"
import { TimeLeftTile } from "components/FreeClass/ClassDetails/TimeLeftTile"
import { RoomUtilsSection } from "components/FreeClass/ClassDetails/RoomUtilsSection"
import { CrowdingSection } from "components/FreeClass/ClassDetails/CrowdingSection"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { api } from "api"
import { RoomDetails } from "api/rooms"
import { ActivityIndicator } from "react-native"

export const RoomDetailsPage: MainStackScreen<"RoomDetails"> = props => {
  const { startDate, roomId, roomLatitude, roomLongitude, occupancies } =
    props.route.params

  const [room, setRoom] = useState<RoomDetails>()

  const getRoomInfo = async () => {
    const selectedRoom = await api.rooms.getRoomInfo(roomId)
    setRoom(selectedRoom)
  }
  useEffect(() => void getRoomInfo(), [])

  return (
    <ContentWrapperScroll
      scrollViewStyle={{ paddingHorizontal: 28, paddingBottom: 60 }}
      style={{ marginTop: 106 }}
    >
      {room !== undefined ? (
        <>
          <InfoMapTile
            address={room.address}
            building={room.building}
            capacity={room.capacity}
            roomName={room.name}
            latitude={roomLatitude}
            longitude={roomLongitude}
          />
          <TimeLeftTile startDate={startDate} occupancies={occupancies} />
          <CrowdingSection roomId={roomId} />
          <RoomUtilsSection power={room.power} />
        </>
      ) : (
        <ActivityIndicator size={"large"} style={{ marginTop: 200 }} />
      )}
    </ContentWrapperScroll>
  )
}
