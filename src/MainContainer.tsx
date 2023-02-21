import React, { FC, useEffect, useState } from "react"
import { View } from "react-native"
import { Tray } from "components/Tray"
import { usePalette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"
import { MainStack } from "navigation/MainStackNavigator"
import { NewsPreferencesContext, Preference } from "contexts/newsPreferences"
import AsyncStorage from "@react-native-async-storage/async-storage"

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
        }}
        onNotifications={() => {
          navigate("RoomDetails", {
            room: {
              name: "2.0.1",
              capacity: 380,
              building: "Edificio 2",
              address: "Piazza Leonardo da Vinci, 32 - 20133 - Milano (MI)",
              power: false,
            },
            startDate: "2023-02-22T16:15:00Z",
            roomId: 32,
            roomLatitude: 45.4788249919485,
            roomLongitude: 9.227210008150676,
            occupancies: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              "19:00": "FREE",
              // eslint-disable-next-line @typescript-eslint/naming-convention
              "19:35": "OCCUPIED",
            },
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
