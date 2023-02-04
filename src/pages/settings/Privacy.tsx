import React from "react"
import { Linking } from "react-native"

import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings/SettingTile"
import { BodyText } from "components/Text"
import { SettingOptions } from "utils/settings"
import { INTRODUCTION } from "utils/privacy"

/**
 * Privacy Settings Page
 */
export const Privacy: SettingsStackScreen<"Privacy"> = () => {
    const { navigate } = useNavigation()

    const settingsList: SettingOptions[] = [
        {
            title: "Esporta dati",
            subtitle: "Ottieni i dati relativi a questo account",
            callback: () => {
                navigate("AccountData")
            },
        },
        {
            title: "Cancella account",
            subtitle: "Cancella i dati relativi a questo account e disconnetti",
            callback: () => {
                navigate("DeleteAccount")
            },
        },
        {
            title: "Imposta autocancellazione",
            subtitle: "Imposta un timer per l'eliminazione dell'account",
        },
        {
            title: "Privacy policy",
            callback: () => {
                Linking.openURL(
                    "https://polinetwork.org/it/learnmore/privacy/"
                ).catch(err => console.log(err))
            },
        },
    ]

    return (
        <ContentWrapperScroll title="Privacy">
            <BodyText
                style={{
                    paddingTop: 50,
                    paddingBottom: 32,
                    paddingHorizontal: 32,
                }}
            >
                {INTRODUCTION}
            </BodyText>
            <Divider />
            <SettingTile setting={settingsList[0]} />
            <SettingTile setting={settingsList[1]} />
            <SettingTile setting={settingsList[2]} />
            <Divider />
            <SettingTile setting={settingsList[3]} />
        </ContentWrapperScroll>
    )
}
