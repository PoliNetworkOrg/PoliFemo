import { FC, useEffect, useState } from "react"
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
    logger("Loading tags preferences from storage")
    AsyncStorage.getItem("newstags:preferences")
      .then(preferencesJSON => {
        if (preferencesJSON) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const data: Record<string, Preference> = JSON.parse(preferencesJSON)
          logger(data)
          setPreferences(data)
        }
      })
      .catch(err => logger(err))
  }, [])

  useEffect(() => {
    logger("Saving tags preferences to storage")
    logger(preferences)
    AsyncStorage.setItem(
      "newstags:preferences",
      JSON.stringify(preferences)
    ).catch(err => logger(err))
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
          logger("downloads")
        }}
        onNotifications={() => {
          logger("notifications")
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
