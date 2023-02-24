import React, { FC, useEffect, useState } from "react"
import { View } from "react-native"
import { Tray } from "components/Tray"
import { usePalette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"
import { MainStack } from "navigation/MainStackNavigator"
import { NewsPreferencesContext, Preference } from "contexts/newsPreferences"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  LogAllScheduledNotifications,
  sendScheduledNotification,
} from "./utils/notifications"

/**
 * The Main Container.
 *
 * It's a view that wraps the pages of the Main Navigator
 */

export const MainContainer: FC = () => {
  const { homeBackground } = usePalette()

  const { navigate } = useNavigation()

  const [preferences, setPreferences] = useState<Record<string, Preference>>({})

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
      <Tray
        onDownloads={() => {
          console.log("downloads")
          void LogAllScheduledNotifications()
        }}
        onNotifications={() => {
          console.log("notifications")
          void sendScheduledNotification(
            {
              body: "descrizione di una notifica standard",
              title: "Notifica standard",
              categoryIdentifier: undefined,
              badge: 1,
              data: { eventId: 123 },
            },
            null
          )
          void sendScheduledNotification(
            {
              title: "Polifemo si sente solo",
              body: "Vuoi scrivergli qualcosa?",
              categoryIdentifier: "message",
              badge: 1,
              data: { eventId: 123 },
            },
            null
          )
          void sendScheduledNotification(
            {
              body: "Premi su Leggi per teletrasportarti in un'altra dimensione",
              title:
                "La tua associazione preferita ti ha in inviato un messaggio",
              categoryIdentifier: "action",
              badge: 1,
              data: { eventId: 456, url: "polifemo://settings_nav/settings" },
            },
            null
          )
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
