import { FC, useEffect, useState } from "react"
import { View } from "react-native"
import { Tray } from "components/Tray"
import { usePalette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"
import { MainStack } from "navigation/MainStackNavigator"
import { NewsPreferencesContext, Preference } from "contexts/newsPreferences"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { RoomsSearchDataContext } from "contexts/rooms"
import { GlobalRoomListInterface, ValidAcronym } from "utils/rooms"

/**
 * The Main Container.
 *
 * It's a view that wraps the pages of the Main Navigator
 */

export const MainContainer: FC = () => {
  const { homeBackground } = usePalette()

  const { navigate } = useNavigation()

  const [preferences, setPreferences] = useState<Record<string, Preference>>({})

  //rooms search date
  const [date, setDate] = useState(new Date())

  const [acronym, setAcronym] = useState<ValidAcronym>("MIA")

  const [globalRoomList, setGlobalRoomList] = useState<GlobalRoomListInterface>(
    {
      MIA: { rooms: [] },
      MIB: { rooms: [] },
      CRG: { rooms: [] },
      LCF: { rooms: [] },
      PCL: { rooms: [] },
      MNI: { rooms: [] },
    }
  )

  const [isRoomsSearching, setIsRoomSearching] = useState(false)

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
          isRoomsSearching: isRoomsSearching,
          setIsRoomsSearching: (val: boolean) => setIsRoomSearching(val),
          acronym: acronym,
          setAcronym: (acronym: ValidAcronym) => setAcronym(acronym),
          date: date,
          setDate: (date: Date) => setDate(date),
          rooms: globalRoomList,
          setRooms: rooms => setGlobalRoomList(rooms),
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
          <MainStack />
        </NewsPreferencesContext.Provider>
      </RoomsSearchDataContext.Provider>
      <Tray
        onDownloads={() => {
          console.log("downloads")
        }}
        onNotifications={() => {
          console.log("downloads")
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
