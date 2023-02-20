import React, { FC, useState } from "react"
import { View, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { Map } from "./Map"
import { FreeClassList } from "./FreeClassList"
import { PermissionStatus } from "expo-location"
import { BuildingItem } from "pages/FreeClass/BuildingChoice"
import { RoomSimplified } from "api/rooms"
import { PositionSearchBar } from "./PositionSearchBar"

interface PositionModalityProps {
  currentCoords: number[]
  locationStatus: PermissionStatus
  buildingList: BuildingItem[] | undefined
}

enum ButtonType {
  MAP,
  LIST,
}

/**
 * It handles the button's state and the two modality: Map or List.
 */
export const PositionModality: FC<PositionModalityProps> = props => {
  const [search, setSearch] = useState("")

  const { primary, isDark, palette } = usePalette()

  const [status, setStatus] = useState<ButtonType>(ButtonType.MAP)

  const [roomList, setRoomList] = useState<RoomSimplified[]>([])

  const extractRooms = (campusName: string[], buildingName: string) => {
    const tempRooms: RoomSimplified[] = []
    props.buildingList?.map(building => {
      if (
        building.campus.name === campusName &&
        building.name === buildingName
      ) {
        tempRooms.push(...building.freeRoomList)
      }
    })
    setRoomList(tempRooms)
  }

  return (
    <>
      <View style={{ marginTop: -23 }}>
        <PositionSearchBar onChange={searchKey => setSearch(searchKey)} />
      </View>
      <View
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Pressable
          style={{
            width: 134,
            height: 44,
            backgroundColor:
              status === ButtonType.MAP
                ? primary
                : isDark
                ? palette.primary
                : palette.lighter,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setStatus(ButtonType.MAP)}
        >
          <BodyText
            style={{
              fontWeight: status === ButtonType.MAP ? "900" : "500",
              color: "white",
            }}
          >
            Mappa
          </BodyText>
        </Pressable>
        <Pressable
          style={{
            width: 134,
            height: 44,
            backgroundColor:
              status === ButtonType.LIST
                ? primary
                : isDark
                ? palette.primary
                : palette.lighter,
            borderRadius: 22,
            marginLeft: 18,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setStatus(ButtonType.LIST)}
        >
          <BodyText
            style={{
              fontWeight: status === ButtonType.LIST ? "900" : "500",
              color: "white",
            }}
          >
            Lista
          </BodyText>
        </Pressable>
      </View>
      {status === ButtonType.LIST ? (
        <View
          style={{
            flex: 1,
            marginTop: -4,
            marginBottom: 93,
          }}
        >
          <FreeClassList data={roomList} date={new Date()} />
        </View>
      ) : (
        <Map
          userLatitude={props.currentCoords[0]}
          userLongitude={props.currentCoords[1]}
          locationStatus={props.locationStatus}
          buildingList={props.buildingList}
          onPressMarker={(campusName: string[], buildingName: string) => {
            setStatus(ButtonType.LIST)
            void extractRooms(campusName, buildingName)
          }}
        />
      )}
    </>
  )
}
