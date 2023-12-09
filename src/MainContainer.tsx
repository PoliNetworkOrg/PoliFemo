import { FC, useEffect, useState } from "react"
import { View } from "react-native"
import { Tray } from "components/Tray"
import { usePalette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"
import { MainStack } from "navigation/MainStackNavigator"
import { NewsPreferencesContext, Preference } from "contexts/newsPreferences"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { RoomsSearchDataContext } from "contexts/rooms"
import { formatDate } from "utils/rooms"
import { useApiCall } from "api/useApiCall"
import { api } from "api"
import { TimeTableContext } from "contexts/timeTable"
import { Region } from "react-native-maps"

/**
 * The Main Container.
 *
 * It's a view that wraps the pages of the Main Navigator
 */

export const MainContainer: FC = () => {
  const { homeBackground } = usePalette()

  const { navigate, getState } = useNavigation()
  const isInsideFreeClassrooms =
    getState().routes[0].state?.routes[1]?.name === "FreeClassrooms"

  const [preferences, setPreferences] = useState<Record<string, Preference>>({})

  //rooms search date
  const [date, setDate] = useState(new Date())

  //timetable
  const [timeTableOpen, setTimeTableOpen] = useState(true)

  //current region map
  const [currentRegionMap, setCurrentRegionMap] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  })

  const [globRooms, isRoomsSearching] = useApiCall(
    api.rooms.getFreeRoomsDay,
    {
      date: formatDate(date),
    },
    [date, isInsideFreeClassrooms],
    {},
    !isInsideFreeClassrooms // prevent calls when outside FreeClassrooms
  )

  const globalRoomList = globRooms ?? {
    MIA: [],
    MIB: [],
    CRG: [],
    LCF: [],
    PCL: [],
    MNI: [],
  }

  useEffect(() => {
    console.log("Loading tags preferences from storage")
    AsyncStorage.getItem("newstags:preferences")
      .then(preferencesJSON => {
        if (preferencesJSON) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const data: Record<string, Preference> = JSON.parse(preferencesJSON)
          console.log(data)
          setPreferences(data)
        }
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    console.log("Saving tags preferences to storage")
    console.log(preferences)
    AsyncStorage.setItem(
      "newstags:preferences",
      JSON.stringify(preferences)
    ).catch(err => console.log(err))
  }, [preferences])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: homeBackground,
      }}
    >
      <RoomsSearchDataContext.Provider
        value={{
          isRoomsSearching,
          date: date,
          setDate: (date: Date) => setDate(date),
          rooms: globalRoomList,
          currentRegionMap,
          setCurrentRegionMap: (region: Region) => setCurrentRegionMap(region),
        }}
      >
        <NewsPreferencesContext.Provider
          value={{
            preferences,
            setArticlesPreferences: pref => {
              setPreferences(pref.preferences)
            },
          }}
        >
          <TimeTableContext.Provider
            value={{
              timeTableOpen: timeTableOpen,
              setTimeTableOpen: status => setTimeTableOpen(status),
            }}
          >
            <MainStack />
          </TimeTableContext.Provider>
        </NewsPreferencesContext.Provider>
      </RoomsSearchDataContext.Provider>
      <Tray
        onDownloads={() => {
          console.log("downloads")
        }}
        onNotifications={() => {
          console.log("notifications")
          navigate("MainNav", {
            screen: "Notifications",
          })
        }}
        onSettings={() => {
          navigate("SettingsNav", {
            screen: "Settings",
          })
        }}
      />
    </View>
  )
}
