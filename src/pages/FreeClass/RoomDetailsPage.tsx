import { MainStackScreen } from "navigation/NavigationTypes"
import { useEffect, useState } from "react"
import { InfoMapTile } from "components/FreeClass/ClassDetails/InfoMapTile"
import { TimeLeftTile } from "components/FreeClass/ClassDetails/TimeLeftTile"
import { RoomUtilsSection } from "components/FreeClass/ClassDetails/RoomUtilsSection"
import { CrowdingSection } from "components/FreeClass/ClassDetails/CrowdingSection"
import { api } from "api"
import { useMounted } from "utils/useMounted"
import { getBuildingCoordsWithoutCampus } from "utils/rooms"
import { useApiCall } from "api/useApiCall"
import { LoadingIndicator } from "components/LoadingIndicator"
import { ScrollPage } from "components/PageLayout"

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

  const [room] = useApiCall(api.rooms.getRoomInfo, { roomId }, [roomId])

  const [latitude, setLatituide] = useState<number | undefined>(roomLatitude)

  const [longitude, setLongitude] = useState<number | undefined>(roomLongitude)

  useEffect(() => {
    if ((!roomLatitude || !roomLongitude) && isMounted) {
      const coords = getBuildingCoordsWithoutCampus(acronymList, room?.building)
      setLatituide(coords?.latitude)
      setLongitude(coords?.longitude)
    }
  }, [room])

  return (
    <ScrollPage padded>
      {room ? (
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
        <LoadingIndicator style={{ marginTop: 200 }} />
      )}
    </ScrollPage>
  )
}
