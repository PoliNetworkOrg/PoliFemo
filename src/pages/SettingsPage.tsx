import React from "react"
import { ScrollView } from "react-native"
import { RootStackScreen } from "navigation/NavigationTypes"
import { SettingsScroll } from "components/Settings/SettingsScroll"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings/SettingTile"
import { IconProps, settingsIcons } from "assets/settings"
import { UserDetailsTile } from "components/Settings/UserDetailsTile"
import { FormCarriere } from "components/Settings/FormCarriere"

export const settingsList: Setting[] = [
    {
        title: "Notifiche",
        subtitle: "Toni messaggi, gruppi",
        icon: settingsIcons.notifiche,
    },
    {
        title: "Aspetto",
        subtitle: "Dark, light mode",
        icon: settingsIcons.modify,
    },
    {
        title: "Aiuto",
        subtitle: "Centro assistenza, contattaci, informativa privacy",
        icon: settingsIcons.help,
    },
    { title: "Disconnetti", icon: settingsIcons.disconnect },
]

export interface Setting {
    title: string
    subtitle?: string
    icon: IconProps
    callback?: () => void
}

/**
 * Settings Page
 */
export const SettingsPage: RootStackScreen<"Settings"> = props => {
    const user = props.route.params.user
    return (
        <SettingsScroll title="Settings">
            <UserDetailsTile
                codPersona={user.codPersona}
                profilePic={user.profilePic}
                nome={user.nome}
                cognome={user.cognome}
            ></UserDetailsTile>
            <FormCarriere carriere={user.carriere}></FormCarriere>
            <Divider />
            <ScrollView>
                {settingsList.map((setting, index) => {
                    return <SettingTile setting={setting} key={index} />
                })}
            </ScrollView>
        </SettingsScroll>
    )
}
