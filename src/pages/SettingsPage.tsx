import React from "react"
import { View, Image, ImageSourcePropType, ScrollView } from "react-native"

import { Text } from "components/Text"

import { usePalette } from "utils/colors"

import { RootStackScreen } from "navigation/NavigationTypes"
import { SettingsScroll } from "components/Settings/SettingsScroll"
import { TouchableRipple } from "components/TouchableRipple"
import { Divider } from "components/Divider"
import help from "assets/settings/help.svg"
import notifiche from "assets/settings/notifiche.svg"
import modify from "assets/settings/modify.svg"
import disconnect from "assets/settings/disconnect.svg"
import { SettingTile } from "components/Settings/SettingTile"
import { IconProps, settingsIcons } from "assets/settings"

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
    const { background, isLight, primary } = usePalette()
    const user = props.route.params.user
    return (
        <SettingsScroll title="Settings">
            <TouchableRipple isRoundedTopCorners={true}>
                <View style={{ paddingHorizontal: 28, paddingVertical: 30 }}>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <View
                            style={{
                                width: 80,
                                height: 80,
                            }}
                        >
                            <Image
                                source={{
                                    uri: user.profilePic,
                                }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    resizeMode: "cover",

                                    borderRadius: 40,
                                }}
                            />
                        </View>
                        <View style={{ marginLeft: 14, paddingTop: 8 }}>
                            <Text
                                style={{
                                    color: isLight ? "#000" : "#fff",
                                    fontSize: 22,
                                    fontWeight: "900",
                                }}
                            >
                                {user.nome} {user.cognome}
                            </Text>
                            <Text
                                style={{
                                    color: isLight ? "#000" : "#fff",
                                    fontSize: 16,
                                    fontWeight: "400",
                                }}
                            >
                                Codice persona {user.codPersona}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableRipple>
            <Divider />
            <ScrollView>
                {settingsList.map((setting, index) => {
                    return <SettingTile setting={setting} key={index} />
                })}
            </ScrollView>
        </SettingsScroll>
    )
}
