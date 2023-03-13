import { FC, useContext, useEffect, useState } from "react"
import { View, Pressable, ActivityIndicator } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { Map } from "./Map"
import { FreeClassList } from "./FreeClassList"
import { PermissionStatus } from "expo-location"
import { HeadquarterItem, CampusItem, BuildingItem } from "./DefaultList"
import { ConstructionType } from "api/rooms"
import { useNavigation } from "@react-navigation/native"
import buildingCoordsJSON from "components/FreeClass/buildingCoords.json"
import { getBuildingInfo, ValidAcronym } from "utils/rooms"
import { ErrorMessage } from "../ErrorMessage"
import { RoomsSearchDataContext } from "contexts/rooms"

interface PositionModalityProps {
  currentCoords: [number, number]
  locationStatus: PermissionStatus
  headquarter: HeadquarterItem | undefined
}

enum ButtonType {
  MAP,
  LIST,
}

/**
 * This component handles the button's state and the two modalities: Map or List.
 * In addition it calls the API to find which rooms and buildings are available
 */
export const PositionModality: FC<PositionModalityProps> = props => {
  const [campusSearched, setCampusSearched] = useState<CampusItem>()

  const { primary, isDark, palette } = usePalette()

  const [status, setStatus] = useState<ButtonType>(ButtonType.MAP)

  const [buildingList, setBuildingList] = useState<BuildingItem[]>()

  const { navigate } = useNavigation()

  const { rooms, acronym } = useContext(RoomsSearchDataContext)

  const findCampusCoordinates = (campusName: string) => {
    const newCampusName = campusName.split(/ (.*)/, 2) //split name by first space(" ") occurence, es: Bovisa La Masa -> ["Bovisa","La Masa"]
    for (const h of buildingCoordsJSON) {
      for (const c of h.campus) {
        if (newCampusName.toString() === c.name.toString()) {
          setCampusSearched({
            type: ConstructionType.CAMPUS,
            name: c.name,
            acronym: h.acronym as ValidAcronym,
            latitude: c.latitude,
            longitude: c.longitude,
          })
          break
        }
      }
    }
  }

  const findRoomsAvailable = () => {
    if (rooms[acronym].rooms.length > 0) {
      const tempBuildingStrings: string[] = []
      const tempBuildingList: BuildingItem[] = []

      rooms[acronym].rooms.map(room => {
        const roomBuilding: string[] = room.building.split(" ")
        roomBuilding[0] += " "

        const currentBuildingString = room.building.replace("Edificio ", "Ed. ")

        if (props.headquarter?.campusList !== undefined) {
          if (!tempBuildingStrings.includes(currentBuildingString)) {
            const currentBuilding = getBuildingInfo(
              props.headquarter,
              room.building
            )
            if (currentBuilding !== undefined) {
              currentBuilding.freeRoomList = [room]
              currentBuilding.fullName = room.building
              tempBuildingStrings.push(currentBuildingString)
              tempBuildingList.push(currentBuilding)
            }
          } else {
            //element already in the list
            const indexElement = tempBuildingStrings.indexOf(
              currentBuildingString
            )
            tempBuildingList[indexElement].freeRoomList.push(room)
          }
        }
      })
      setBuildingList(tempBuildingList)
    }
  }

  useEffect(() => {
    void findRoomsAvailable()
  }, [rooms[acronym].rooms])

  return (
    <>
      <View
        style={{
          marginTop: 30,
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
          {props.headquarter !== undefined ? (
            rooms[acronym].rooms === undefined ? (
              <ActivityIndicator
                style={{ marginTop: 50, marginLeft: 3 }}
                size="large"
              />
            ) : (
              <FreeClassList data={rooms[acronym].rooms} date={new Date()} />
            )
          ) : (
            <ErrorMessage
              message="Non ci sono aule libere nelle vicinanze"
              styleView={{ marginTop: 100, marginHorizontal: 20 }}
              styleMessage={{
                alignSelf: "center",
                color: "red",
                fontWeight: "400",
                fontSize: 30,
                textAlign: "center",
              }}
            />
          )}
        </View>
      ) : (
        <Map
          userLatitude={props.currentCoords[0]}
          userLongitude={props.currentCoords[1]}
          locationStatus={props.locationStatus}
          buildingList={buildingList}
          campusSearched={campusSearched}
          onPressMarker={(building: BuildingItem) => {
            navigate(
              "ClassChoice" as never,
              {
                building: building,
              } as never
            )
          }}
        />
      )}
    </>
  )
}
