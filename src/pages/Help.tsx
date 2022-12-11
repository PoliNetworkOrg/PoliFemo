import React from "react"
import { ScrollView, View } from "react-native"
import { RootStackScreen } from "navigation/NavigationTypes"
import { SettingsScroll } from "components/Settings/SettingsScroll"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings/SettingTile"
import { IconProps, settingsIcons } from "assets/settings"
import { UserDetailsTile } from "components/Settings/UserDetailsTile"

import { Setting } from "components/Settings/Setting"

export const settingsList: Setting[] = [
    {
        title: "Centro Assistenza",
        subtitle: "descrizione placeholder",
    },
    {
        title: "Contattaci",
        subtitle: "descrizione placeholder",
    },
    {
        title: "Termini e privacy",
        subtitle: "descrizione plaiceholder",
    },
    {
        title: "Informazioni App",
        subtitle: "descrizione placeholder",
    },
]
/**
 * Notifications Settings Page
 */
export const Help: RootStackScreen<"Help"> = props => {
    return (
        <SettingsScroll title="Notifiche">
            <View style={{ paddingTop: 32 }}>
                {settingsList.map((setting, index) => {
                    return <SettingTile setting={setting} key={index} />
                })}
            </View>
        </SettingsScroll>
    )
}
