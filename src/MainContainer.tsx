import { FC, useEffect, useState } from "react"
import { View } from "react-native"
import { Tray } from "components/Tray"
import { usePalette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"
import { MainStack } from "navigation/MainStackNavigator"
import { NewsPreferencesContext, Preference } from "contexts/newsPreferences"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { RoomsSearchDataContext } from "contexts/rooms"
import { GlobalRoomListInterface } from "utils/rooms"
import { NotificationCentre } from "./notifications/NotificationCentre"

const notificationCentre = NotificationCentre.getInstance()

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

  const [globalRoomList, setGlobalRoomList] = useState<GlobalRoomListInterface>(
    {
      MIA: [],
      MIB: [],
      CRG: [],
      LCF: [],
      PCL: [],
      MNI: [],
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
          void notificationCentre.sendScheduledNotification(
            {
              title: "Notifica ISEE",
              body: "Attenzione sta per scadere l'isee",
              data: {
                sender: "Polimi",
                channelId: "comunicazioni",
                content:
                  "Questa è il content della notifica, ricordati dell'ISEE",

                object: "oggetto",
              },
            },
            { seconds: 3 },
            "comunicazioni"
          )
          void notificationCentre.sendScheduledNotification(
            {
              title: "Notifica UPLOAD",
              body: "Prova",
              data: {
                sender: "Sconosciuto",
                channelId: "upload",
                content: "Guarda i tuoi upload",
                object: "oggetto!",
              },
            },
            null
          )
          void notificationCentre.sendScheduledNotification(
            {
              title: "Notifica SCACCHI",
              body: "prova",
              data: {
                sender: "polimi scacchi",
                cacheOnSchedule: false,
                channelId: "associazioni",
                content: "vieni a giocare a scacchi",
                object: "come vincere a scacchi",
                linkUrl:
                  "https://images.unsplash.com/photo-1560174038-da43ac74f01b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2057&q=80",
              },
            },
            {
              date: new Date(new Date().getTime() + 2000),
            }
          )
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
