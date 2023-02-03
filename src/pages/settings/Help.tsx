import React from "react"
import { View } from "react-native"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { SettingsScroll } from "components/Settings/SettingsScroll"
import { SettingTile } from "components/Settings/SettingTile"
import { SettingOptions } from "contexts/settings"

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
export const Help: SettingsStackScreen<"Help"> = () => {
    return (
        <SettingsScroll title="Aiuto">
            <View style={{ paddingTop: 32 }}>
                {settingsList.map((setting, index) => {
                    return <SettingTile setting={setting} key={index} />
                })}
            </View>
        </SettingsScroll>
    )
}
