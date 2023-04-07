import { FC, useEffect, useState } from "react"
import { View } from "react-native"
import { Tray } from "components/Tray"
import { usePalette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"
import { MainStack } from "navigation/MainStackNavigator"
import { NewsPreferencesContext, Preference } from "contexts/newsPreferences"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { RoomsSearchDataContext } from "contexts/rooms"
import { NotificationCentre } from "./notifications/NotificationCentre"
import { formatDate } from "utils/rooms"
import { useApiCall } from "api/useApiCall"
import { api } from "api"

const notificationCentre = NotificationCentre.getInstance()
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
              title: "Notifica Comunicazioni di prova",
              body: "Questo è il body del messaggio di prova. Questa notifica arriva istantaneamente",
              data: {
                sender: "Sender",
                content:
                  "Questo è il content del messaggio Comunicazioni di prova",
                object: "Questo è l'oggetto del messaggio di prova",
                deepLink: true,
              },
            },
            null,
            "comunicazioni"
          )
          void notificationCentre.sendScheduledNotification(
            {
              title: "Notifica UPLOAD di prova",
              body: "Questo è il body del messaggio di prova. Questa notifica arriva istantaneamente",
              data: {
                sender: "Sender",
                content: "Questo è il content del messaggio Upload di prova",
                object: "Questo è l'oggetto del messaggio di prova",
                deepLink: true,
              },
            },
            null,
            "upload"
          )
          void notificationCentre.sendScheduledNotification(
            {
              title: "Notifica ASSOCIAZIONI di prova",
              body: "Questo è il body del messaggio di prova. Questa notifica arriva dopo 2 secondi",
              data: {
                sender: "Associazione del Poli",
                content:
                  "Questo è il content del messaggio Associazioni di prova",
                object: "Questo è l'oggetto del messaggio di prova",
                linkUrl:
                  "https://images.unsplash.com/photo-1560174038-da43ac74f01b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2057&q=80",
                deepLink: true,
              },
            },
            {
              date: new Date(new Date().getTime() + 1000 * 2),
            },
            "associazioni"
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
