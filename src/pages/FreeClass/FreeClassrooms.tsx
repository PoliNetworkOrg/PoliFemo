import { useContext, useEffect, useState } from "react"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View, Alert, ActivityIndicator, StyleSheet } from "react-native"
import { PoliSearchBar } from "components/Home"
import { usePalette } from "utils/colors"
import { Title, BodyText } from "components/Text"
import campusIcon from "assets/freeClassrooms/campus.svg"
import positionIcon from "assets/freeClassrooms/position.svg"
import * as Location from "expo-location"
import {
  formatDate,
  getExpirationDateRooms,
  isSameDay,
  ValidAcronym,
} from "utils/rooms"
import { api, RetryType } from "api"
import { RoomsSearchDataContext } from "contexts/rooms"
import { Icon } from "components/Icon"
import { Room } from "api/rooms"
import { FreeClassList } from "components/FreeClass/FreeClassList"
import { PageWrapper } from "components/Groups/PageWrapper"
import { ScrollView } from "react-native-gesture-handler"
import { AdaptiveShadowView } from "components/BoxShadow"
import { useTranslation } from "react-i18next"

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

  const { rooms, setRooms, date, setIsRoomsSearching, isRoomsSearching } =
    useContext(RoomsSearchDataContext)

  //rooms filtered
  const [searchableRooms, setSearchableRooms] = useState<Room[]>([])

  const { t } = useTranslation("freeClass")

  const positionButtonMessage = t("freeClass_position").split("-")

  const headquarterButtonMessage = t("freeClass_headquarter").split("-")

  //main function that handles the call to the API in order to obtain the list of freeclassRooms
  const getAllRoomsFromApi = async (
    overrideDate?: Date,
    overrideSearchBehaviour?: boolean
  ) => {
    const searchDate = overrideDate ?? date

    //Check if stored rooms are still relevant to the current search
    const prevSearchDateISO = rooms.searchDate
    if (prevSearchDateISO) {
      const prevSearchDate = new Date(prevSearchDateISO)
      if (isSameDay(prevSearchDate, searchDate)) {
        const currentExpirationDateISO = rooms.expireAt
        if (currentExpirationDateISO) {
          const currentExpirationDate = new Date(currentExpirationDateISO)
          if (new Date() < currentExpirationDate) {
            // not expired and relevant
            return
          }
        }
      }
    }
    //expired and/or not relevant

    if (!overrideSearchBehaviour) {
      setIsRoomsSearching(true)
    }
    const { data, expire } = await api.rooms.getFreeRoomsDay(
      formatDate(searchDate),
      { maxRetries: 1, retryType: RetryType.RETRY_N_TIMES }
    )
    if (data) {
      const newGlobalRooms = { ...data }

      const expirationDate = getExpirationDateRooms(expire)
      //update expiration date or reset
      newGlobalRooms.expireAt = expirationDate?.toISOString() ?? undefined
      //update searchDate
      newGlobalRooms.searchDate = searchDate.toISOString()
      setRooms(newGlobalRooms)
    }
    if (!overrideSearchBehaviour) {
      setIsRoomsSearching(false)
    }
  }

  useEffect(() => {
    void getAllRoomsFromApi()
  }, [date])

  const [geolocation, setGeolocation] = useState<boolean>(false)

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
        setGeolocation(true)
        navigate("PositionChoice")
      }
    }
  }

  //filter rooms locally
  const filterRooms = () => {
    const newSearchableRooms: Room[] = []
    const acronyms: ValidAcronym[] = ["MIA", "MIB", "CRG", "LCF", "PCL", "MNI"]

    for (const currAcronym of acronyms) {
      const roomsInCampus = rooms[currAcronym] ?? []

      for (const room of roomsInCampus) {
        if (room.name.toLowerCase().includes(search.toLowerCase().trimEnd())) {
          newSearchableRooms.push(room)
        }
      }
    }

    setSearchableRooms(newSearchableRooms)
  }

  //SearchBar side-effect
  useEffect(() => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      if (search.trimEnd().length > 1) {
        void filterRooms()

        //request rooms if old ones have expired
        void getAllRoomsFromApi(new Date())
      } else {
        setSearchableRooms([])
      }
    }, deltaTime)
  }, [search, rooms])

  return (
    <PageWrapper>
      <View style={{ paddingTop: 28 }}>
        <Title style={{ paddingLeft: 28, marginBottom: 17 }}>
          {t("freeClass_title")}
        </Title>
        <PoliSearchBar onChange={searchKey => setSearch(searchKey)} />
      </View>
      {isRoomsSearching && search.length > 1 ? (
        <ActivityIndicator size={"large"} style={{ marginTop: 100 }} />
      ) : search.length <= 1 ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          bounces={false}
        >
          <View style={{ alignItems: "stretch" }}>
            <AdaptiveShadowView
              style={styles.choiceButton}
              contentContainerStyle={[
                styles.choiceContent,
                { backgroundColor: palette.primary },
              ]}
              onPress={() => handlePositionPressed()}
              shadow={{ offset: { y: 4 }, opacity: 0.25, blur: 4 }}
            >
              <Icon style={{ marginTop: 5 }} source={positionIcon} />
              <BodyText style={{ fontWeight: "300", color: "white" }}>
                {positionButtonMessage[0]}{" "}
                <BodyText style={{ fontWeight: "900", color: "white" }}>
                  {positionButtonMessage[1]}
                </BodyText>
              </BodyText>
            </AdaptiveShadowView>

            <AdaptiveShadowView
              shadow={{ offset: { y: 4 }, opacity: 0.25, blur: 4 }}
              style={styles.choiceButton}
              contentContainerStyle={[
                styles.choiceContent,
                { backgroundColor: palette.primary },
              ]}
              onPress={() => navigate("HeadquarterChoice")}
            >
              <Icon style={{ marginTop: 5 }} source={campusIcon} />
              <BodyText style={{ fontWeight: "300", color: "white" }}>
                {headquarterButtonMessage[0]}{" "}
                <BodyText style={{ fontWeight: "900", color: "white" }}>
                  {headquarterButtonMessage[1]}
                </BodyText>
              </BodyText>
            </AdaptiveShadowView>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1, marginTop: 12, marginBottom: 93 }}>
          <FreeClassList data={searchableRooms} date={new Date()} />
        </View>
      )}
    </PageWrapper>
  )
}

const styles = StyleSheet.create({
  choiceButton: {
    marginTop: 18,
    marginHorizontal: 28,
  },
  choiceContent: {
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 23,
    height: 190,
  },
})
