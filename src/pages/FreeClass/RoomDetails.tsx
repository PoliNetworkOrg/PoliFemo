import { MainStackScreen } from "navigation/NavigationTypes"
import React from "react"
import { PageWrapper } from "components/FreeClass/ClassDetails/PageWrapper"
import { InfoMapTile } from "components/FreeClass/ClassDetails/InfoMapTile"
import { TimeLeftTile } from "components/FreeClass/ClassDetails/TimeLeftTile"
import { RoomUtilsSection } from "components/FreeClass/ClassDetails/RoomUtilsSection"
import { CrowdingSection } from "components/FreeClass/ClassDetails/CrowdingSection"
/* eslint-disable @typescript-eslint/naming-convention */

export const RoomDetails: MainStackScreen<"RoomDetails"> = props => {
    // funny how renaming it class breaks everything, because class is also a keyword
    const { room, startDate, roomId } = props.route.params

    return (
        <PageWrapper style={{ paddingHorizontal: 28, paddingBottom: 115 }}>
            <InfoMapTile
                address={room.address}
                building={room.building}
                capacity={room.capacity}
                roomName={room.name}
            />
            <TimeLeftTile startDate={startDate} />
            <CrowdingSection roomId={roomId}/>
            <RoomUtilsSection power={room.power} />
        </PageWrapper>
    )
}
