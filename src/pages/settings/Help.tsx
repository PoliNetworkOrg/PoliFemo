import React from "react"
import { View } from "react-native"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { SettingTile, SettingOptions } from "components/Settings/SettingTile"

export const settingsList: SettingOptions[] = [
  {
    title: "Centro Assistenza",
    subtitle: "descrizione placeholder",
  },
  {
    title: "Contattaci",
    subtitle: "descrizione placeholder",
  },
  {
    title: "Informazioni App",
    subtitle: "descrizione placeholder",
  },
]
/**
 * Notifications Settings Page
 */
export const Help: SettingsStackScreen<"Help"> = () => {
  return (
    <ContentWrapperScroll title="Aiuto">
      <View style={{ paddingTop: 32 }}>
        {settingsList.map((setting, index) => {
          return <SettingTile setting={setting} key={index} />
        })}
      </View>
    </ContentWrapperScroll>
  )
}
