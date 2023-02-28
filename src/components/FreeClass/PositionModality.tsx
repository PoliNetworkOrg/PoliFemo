import React, { FC, useState } from "react"
import { View, Pressable, ActivityIndicator } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { Map } from "./Map"
import { FreeClassList } from "./FreeClassList"
import { PermissionStatus } from "expo-location"
import { BuildingItem } from "pages/FreeClass/BuildingChoice"
import { ConstructionType, RoomSimplified } from "api/rooms"
import { useNavigation } from "@react-navigation/native"
import { PositionPicker } from "./PositionPicker"
import { CampusItem } from "pages/FreeClass/CampusChoice"
import buildingCoordsJSON from "components/FreeClass/buildingCoords.json"

interface PositionModalityProps {
  currentCoords: number[]
  locationStatus: PermissionStatus
  buildingList: BuildingItem[] | undefined
  roomList: RoomSimplified[] | undefined
}

enum ButtonType {
  MAP,
  LIST,
}

/**
 * It handles the button's state and the two modality: Map or List.
 */
export const PositionModality: FC<PositionModalityProps> = props => {
  const [campusSearched, setCampusSearched] = useState<CampusItem>()

  const { primary, isDark, palette } = usePalette()

  const [status, setStatus] = useState<ButtonType>(ButtonType.MAP)

  const { navigate } = useNavigation()

  const findCampusCoordinates = (campusName: string) => {
    const newCampusName = campusName.split(/ (.*)/, 2) //split name by first space(" ") occurence, es: Bovisa La Masa -> ["Bovisa","La Masa"]
    for (const h of buildingCoordsJSON) {
      for (const c of h.campus) {
        if (newCampusName.toString() === c.name.toString()) {
          setCampusSearched({
            type: ConstructionType.CAMPUS,
            name: c.name,
            acronym: h.acronym,
            latitude: c.latitude,
            longitude: c.longitude,
          })
          break
        }
      }
    }
  }

  return (
    <>
      <View style={{ marginTop: -23 }}>
        <PositionPicker
          onPositionSelected={campusName => findCampusCoordinates(campusName)}
        />
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
            marginBottom: 93,
          }}
        >
          {props.roomList === undefined ? (
            <ActivityIndicator
              style={{ marginTop: 50, marginLeft: 3 }}
              size="large"
            />
          ) : (
            <FreeClassList data={props.roomList} date={new Date()} />
          )}
        </View>
      ) : (
        <Map
          userLatitude={props.currentCoords[0]}
          userLongitude={props.currentCoords[1]}
          locationStatus={props.locationStatus}
          buildingList={props.buildingList}
          campusSearched={campusSearched}
          onPressMarker={(building: BuildingItem) =>
            navigate(
              "ClassChoice" as never,
              {
                building: building,
                currentDate: new Date().toString(),
              } as never
            )
          }
        />
      )}
    </>
  )
}
