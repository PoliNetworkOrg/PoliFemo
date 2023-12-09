import { useContext, useEffect, useState } from "react"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View, Alert, ActivityIndicator, StyleSheet } from "react-native"
import { PoliSearchBar } from "components/PoliSearchBar"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import campusIcon from "assets/freeClassrooms/campus.svg"
import positionIcon from "assets/freeClassrooms/position.svg"
import * as Location from "expo-location"
import { isRoomFree, ValidAcronym } from "utils/rooms"
import { RoomsSearchDataContext } from "contexts/rooms"
import { Icon } from "components/Icon"
import { Room } from "api/collections/rooms"
import { FreeClassList } from "components/FreeClass/FreeClassList"
import { ScrollView } from "react-native-gesture-handler"
import { AdaptiveShadowView } from "components/BoxShadow"
import { useTranslation } from "react-i18next"
import { PageWrap } from "components/PageLayout"

let searchTimeout: NodeJS.Timeout
const deltaTime = 200 //ms

/**
 * This is the first page where the user select the modality to find a free room.
 * There are two options:
 * - Selection by campus
 * - Selection by current user position->this feature is available ONLY IF the GPS is enabled.
 */
export const FreeClassrooms: MainStackScreen<"FreeClassrooms"> = () => {
  const { t } = useTranslation("freeClass")
  const positionButtonMessage = t("freeClass_position").split("-")
  const headquarterButtonMessage = t("freeClass_headquarter").split("-")

  const [search, setSearch] = useState("")
  const { navigate } = useNavigation()
  const { palette } = usePalette()

  const { rooms, date, isRoomsSearching, setDate } = useContext(
    RoomsSearchDataContext
  )

  //rooms filtered
  const [searchableRooms, setSearchableRooms] = useState<Room[]>([])

  const [geolocation, setGeolocation] = useState<boolean>(false)

  const handlePositionPressed = async () => {
    if (geolocation) {
      //if the geolocation is active, the user can proceed
      navigate("PositionChoice")
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== Location.PermissionStatus.GRANTED) {
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
        if (
          room.name.toLowerCase().includes(search.toLowerCase().trimEnd()) &&
          isRoomFree(room, new Date(), true)
        ) {
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
        const today = new Date()
        if (
          date.toISOString().substring(0, 10) !==
          today.toISOString().substring(0, 10)
        )
          setDate(today)
        void filterRooms()
      } else {
        setSearchableRooms([])
      }
    }, deltaTime)
  }, [search, rooms])

  return (
    <PageWrap title={t("freeClass_title") + ""}>
      <PoliSearchBar
        style={{
          marginTop: 12,
        }}
        onChange={searchKey => setSearch(searchKey)}
      />
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
    </PageWrap>
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
