import { MainStackScreen } from "navigation/NavigationTypes"
import React from "react"
import { PageWrapper } from "components/FreeClass/ClassDetails/PageWrapper"
import { InfoMapTile } from "components/FreeClass/ClassDetails/InfoMapTile"
import { TimeLeftTile } from "components/FreeClass/ClassDetails/TimeLeftTile"
import { RoomUtilsSection } from "components/FreeClass/ClassDetails/RoomUtilsSection"
import { CrowdingSection } from "components/FreeClass/ClassDetails/CrowdingSection"

export const RoomDetails: MainStackScreen<"RoomDetails"> = props => {
  const { room, startDate, roomId, roomLatitude, roomLongitude, occupancies } =
    props.route.params

  return (
    <PageWrapper style={{ paddingHorizontal: 28, paddingBottom: 115 }}>
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
    </PageWrapper>
  )
}
