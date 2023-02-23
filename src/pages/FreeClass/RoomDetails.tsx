import { MainStackScreen } from "navigation/NavigationTypes"
import React from "react"
import { InfoMapTile } from "components/FreeClass/ClassDetails/InfoMapTile"
import { TimeLeftTile } from "components/FreeClass/ClassDetails/TimeLeftTile"
import { RoomUtilsSection } from "components/FreeClass/ClassDetails/RoomUtilsSection"
import { CrowdingSection } from "components/FreeClass/ClassDetails/CrowdingSection"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"

export const RoomDetails: MainStackScreen<"RoomDetails"> = props => {
  const { room, startDate, roomId, roomLatitude, roomLongitude, occupancies } =
    props.route.params

  return (
    <ContentWrapperScroll
      scrollViewStyle={{ paddingHorizontal: 28, paddingBottom: 60 }}
      style={{ marginTop: 106 }}
    >
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
    </ContentWrapperScroll>
  )
}
