/* eslint-disable @typescript-eslint/naming-convention */
import { useContext, useEffect, useState } from "react"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import {
  View,
  Dimensions,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native"
import { PoliSearchBar } from "components/Home"
import { usePalette } from "utils/colors"
import { Title, BodyText } from "components/Text"
import campusIcon from "assets/freeClassrooms/campus.svg"
import position1Icon from "assets/freeClassrooms/position1.svg"
import position2Icon from "assets/freeClassrooms/position2.svg"
import * as Location from "expo-location"
import {
  formatDate,
  getExpirationDateRooms,
  getRoomFromId,
  isSameDay,
  isValidAcronym,
  ValidAcronym,
} from "utils/rooms"
import { api, RetryType } from "api"
import { RoomsSearchDataContext } from "contexts/rooms"
import { Icon } from "components/Icon"
import roomsJSON from "components/FreeClass/rooms.json"
import { Room } from "api/rooms"
import { FreeClassList } from "components/FreeClass/FreeClassList"
import { PageWrapper } from "components/Groups/PageWrapper"
import { ScrollView } from "react-native-gesture-handler"

const { width } = Dimensions.get("window")

enum SearchClassType {
  GPS_POSITION,
  HEADQUARTER,
}
interface FreeClassInterface {
  id: number
  type: SearchClassType
  text: string[]
}

const freeClassButtons: FreeClassInterface[] = [
  {
    id: 0,
    type: SearchClassType.GPS_POSITION,
    text: ["In base alla tua", "posizione"],
  },
  { id: 1, type: SearchClassType.HEADQUARTER, text: ["Scegli la tua", "sede"] },
]

let searchTimeout: NodeJS.Timeout
const deltaTime = 200 //ms

/**
 * This is the first page where the user select the modality to find a free room.
 * There are two options:
 * - Selection by campus
 * - Selection by current user position->this feature is available ONLY IF the GPS is enabled.
 */
export const FreeClassrooms: MainStackScreen<"FreeClassrooms"> = () => {
  const [search, setSearch] = useState("")
  const { navigate } = useNavigation()
  const { palette } = usePalette()

  const { rooms, setRooms, date, acronym, setIsRoomsSearching } = useContext(
    RoomsSearchDataContext
  )

  //rooms filtered locally
  const [searchableRooms, setSearchableRooms] = useState<Partial<Room>[]>([])

  //shown rooms
  const [actualSearchableRooms, setActualSearchableRooms] = useState<Room[]>([])

  //for searching in multiple campuses
  const [acronymList, setAcronymList] = useState<ValidAcronym[]>([])

  //keep track of when to show activity indicator
  const [isSearchBarSearching, setIsSearchBarSearching] = useState(false)

  //main function that handles the call to the API in order to obtain the list of freeclassRooms
  const getAllRoomsFromApi = async (
    overrideAcr?: ValidAcronym,
    overrideDate?: Date,
    overrideSearchBehaviour?: boolean
  ) => {
    const searchAcronym = overrideAcr ?? acronym
    const searchDate = overrideDate ?? date

    if (!acronym) {
      return
    }
    //Check if stored rooms are still relevant to the current search
    const prevSearchDateISO = rooms[searchAcronym].searchDate
    if (prevSearchDateISO) {
      const prevSearchDate = new Date(prevSearchDateISO)
      if (isSameDay(prevSearchDate, searchDate)) {
        const currentExpirationDateISO = rooms[searchAcronym].expireAt
        if (currentExpirationDateISO) {
          const currentExpirationDate = new Date(currentExpirationDateISO)
          if (new Date() < currentExpirationDate) {
            // not expired and relevant
            return
          }
        }
      }
    }
    //expired and not relevant

    if (!overrideSearchBehaviour) {
      setIsRoomsSearching(true)
    }
    const { data, expire } = await api.rooms.getFreeRoomsDay(
      searchAcronym,
      formatDate(searchDate),
      { maxRetries: 1, retryType: RetryType.RETRY_N_TIMES }
    )
    if (data.length > 0) {
      const newGlobalRooms = { ...rooms }
      newGlobalRooms[searchAcronym].rooms = data
      const expirationDate = getExpirationDateRooms(expire)
      //update expiration date or reset
      newGlobalRooms[searchAcronym].expireAt =
        expirationDate?.toISOString() ?? undefined
      //update searchDate
      newGlobalRooms[searchAcronym].searchDate = searchDate.toISOString()
      setRooms(newGlobalRooms)
    }
    if (!overrideSearchBehaviour) {
      setIsRoomsSearching(false)
    }
  }

  useEffect(() => {
    void getAllRoomsFromApi()
  }, [date, acronym])

  const [geolocation, setGeoloaction] = useState<boolean>(false)

  const handlePositionPressed = async () => {
    if (geolocation) {
      //if the geolocation is active, the user can proceed
      navigate("PositionChoice")
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Location Service not enabled",
          "Please enable your location services to unlock this feature",
          [{ text: "OK" }],
          { cancelable: false }
        )
      } else {
        setGeoloaction(true)
        navigate("PositionChoice")
      }
    }
  }

  //filter rooms locally
  const filterRoomsJSON = () => {
    const newAcronymList: ValidAcronym[] = []
    const newSearchableRooms: Partial<Room>[] = []
    const roomsAll: { [key: string]: { [key: string]: number } } = roomsJSON
    const keys = Object.keys(roomsAll)
    for (const currAcronym of keys) {
      const roomsInCampus = roomsAll[currAcronym]
      const roomsNames = Object.keys(roomsInCampus)
      for (const roomName of roomsNames) {
        if (roomName.toLowerCase().includes(search.toLowerCase().trimEnd())) {
          newSearchableRooms.push({
            room_id: roomsInCampus[roomName],
            name: roomName,
          })
          if (
            isValidAcronym(currAcronym) &&
            !newAcronymList.includes(currAcronym)
          ) {
            newAcronymList.push(currAcronym)
          }
        }
      }
    }

    setAcronymList(newAcronymList)
    setSearchableRooms(newSearchableRooms)
  }

  //SearchBar side-effect
  useEffect(() => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      if (search.trimEnd().length > 1) {
        void filterRoomsJSON()
      } else {
        setSearchableRooms([])
        setActualSearchableRooms([])
      }
    }, deltaTime)
  }, [search])

  // request rooms in the relevant acronyms (filtered locally in filterRoomsJSON)
  const searchMultiple = async () => {
    setIsSearchBarSearching(true)
    for (const acr of acronymList) {
      await getAllRoomsFromApi(acr, new Date(), true)
    }
    setIsSearchBarSearching(false)
  }

  useEffect(() => {
    void searchMultiple()
  }, [acronymList])

  //update actually showable rooms by matching local and server-delivered room
  useEffect(() => {
    if (isSearchBarSearching) {
      return
    }
    const newRooms: Room[] = []

    for (const room of searchableRooms) {
      const matchingRoom = getRoomFromId(rooms, acronymList, room.room_id)
      if (matchingRoom) {
        newRooms.push(matchingRoom)
      }
    }

    setActualSearchableRooms(newRooms)
  }, [rooms, isSearchBarSearching, searchableRooms])

  return (
    <PageWrapper>
      <View style={{ paddingTop: 28 }}>
        <Title style={{ paddingLeft: 28, marginBottom: 17 }}>Aule Libere</Title>
        <PoliSearchBar onChange={searchKey => setSearch(searchKey)} />
      </View>
      {isSearchBarSearching ? (
        <ActivityIndicator size={"large"} style={{ marginTop: 100 }} />
      ) : actualSearchableRooms.length === 0 ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          bounces={false}
        >
          <View style={{ width, alignItems: "center" }}>
            {freeClassButtons.map(item => (
              <Pressable
                key={"freeClass_" + item.id}
                style={{
                  marginTop: 18,
                  backgroundColor: palette.primary,
                  width: width - 54,
                  height: 190,
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  alignItems: "center",
                }}
                onPress={
                  item.type === SearchClassType.HEADQUARTER
                    ? () => navigate("HeadquarterChoice")
                    : () => handlePositionPressed()
                }
              >
                {item.type === SearchClassType.HEADQUARTER ? (
                  <Icon
                    style={{ marginTop: 33, marginBottom: 25 }}
                    source={campusIcon}
                  />
                ) : (
                  <>
                    <Icon style={{ marginTop: 28 }} source={position1Icon} />
                    <Icon
                      style={{
                        marginTop: -11,
                        marginLeft: 3,
                        marginBottom: 25,
                      }}
                      source={position2Icon}
                    />
                  </>
                )}
                <BodyText
                  style={{
                    fontWeight: "300",
                    color: "white",
                  }}
                >
                  {item.text[0]}{" "}
                  <BodyText
                    style={{
                      fontWeight: "900",
                      color: "white",
                    }}
                  >
                    {item.text[1]}
                  </BodyText>
                </BodyText>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1, marginTop: 12, marginBottom: 93 }}>
          <FreeClassList
            data={actualSearchableRooms}
            date={new Date()}
            acronymList={acronymList}
          />
        </View>
      )}
    </PageWrapper>
  )
}
