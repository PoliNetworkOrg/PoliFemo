import React from "react"
import { ScrollView, View, StyleSheet } from "react-native"
import { RootStackScreen } from "navigation/NavigationTypes"
import { SettingsScroll } from "components/Settings/SettingsScroll"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings/SettingTile"
import { IconProps, settingsIcons } from "assets/settings"
import { UserDetailsTile } from "components/Settings/UserDetailsTile"

import { Setting } from "components/Settings/Setting"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"

const settingsList: Setting[] = [
    {
        title: "Tono notifiche",
        subtitle: "qui ci va qualcosa",
        icon: undefined,
    },
    {
        title: "Vibrazione",
        subtitle: "predefinita",
        icon: undefined,
    },
    {
        title: "Qualcosa",
        subtitle: "Anche qui ci va scritto qualcosa",
        icon: undefined,
    },
    {
        title: "Qualcosa",
        subtitle: "Un altra descrizione lunga ma non troppo",
        icon: undefined,
    },
]

const settingsListGruppi: Setting[] = [
    {
        title: "Notifiche",
        subtitle: "Toni messaggi. gruppi",
        icon: undefined,
    },
    {
        title: "Notifiche",
        subtitle: "Toni messaggi. gruppi",
        icon: undefined,
    },
]
/**
 * Notifications Settings Page
 */
export const Notifications: RootStackScreen<"Notifications"> = props => {
    const { isLight, palette } = usePalette()
    return (
        <SettingsScroll title="Notifiche">
            <View>
                <Text
                    style={[
                        {
                            color: isLight ? palette.primary : palette.lighter,
                        },
                        styles.title,
                    ]}
                >
                    Titolo della sezione
                </Text>
            </View>

            {settingsList.map((setting, index) => {
                return <SettingTile setting={setting} key={index} />
            })}
            <Divider />

            <View>
                <Text
                    style={[
                        {
                            color: isLight ? palette.primary : palette.lighter,
                        },
                        styles.title,
                    ]}
                >
                    Gruppi
                </Text>
            </View>

            {settingsListGruppi.map((setting, index) => {
                return <SettingTile setting={setting} key={index} />
            })}
        </SettingsScroll>
    )
}

const styles = StyleSheet.create({
    title: {
        paddingHorizontal: 30,
        paddingTop: 28,
        paddingBottom: 8,
        fontSize: 16,
    },
})
