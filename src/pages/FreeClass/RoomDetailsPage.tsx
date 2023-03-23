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
import { useMounted } from "utils/useMounted"
import { getBuildingCoordsWithoutCampus } from "utils/rooms"

export const RoomDetailsPage: MainStackScreen<"RoomDetails"> = props => {
  const {
    startDate,
    roomId,
    roomLatitude,
    roomLongitude,
    occupancies,
    acronymList,
  } = props.route.params

  const isMounted = useMounted()

  const [room, setRoom] = useState<RoomDetails>()

  const [latitude, setLatituide] = useState<number | undefined>(roomLatitude)

  const [longitude, setLongitude] = useState<number | undefined>(roomLongitude)

  const getRoomInfo = async () => {
    const selectedRoom = await api.rooms.getRoomInfo(roomId)
    setRoom(selectedRoom)
  }
  useEffect(() => void getRoomInfo(), [])

  useEffect(() => {
    if ((!roomLatitude || !roomLongitude) && isMounted) {
      const coords = getBuildingCoordsWithoutCampus(acronymList, room?.building)
      setLatituide(coords?.latitude)
      setLongitude(coords?.longitude)
    }
  }, [room])

  return (
    <ContentWrapperScroll
      scrollViewStyle={{ paddingHorizontal: 28, paddingBottom: 60 }}
    >
      {room !== undefined ? (
        <>
          <InfoMapTile
            address={room.address}
            building={room.building}
            capacity={room.capacity}
            roomName={room.name}
            latitude={latitude}
            longitude={longitude}
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