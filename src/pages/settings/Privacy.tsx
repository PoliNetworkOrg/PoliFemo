import React, { useState, useContext } from "react"
import { View } from "react-native"

import { api } from "api"
import { HttpClient } from "api/HttpClient"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { ModalConfirm } from "components/Settings/ModalConfirm"
import { SettingTile } from "components/Settings/SettingTile"
import { SettingOptions } from "utils/settings"
import { LoginContext } from "utils/login"

const client = HttpClient.getInstance()

/**
 * Privacy Settings Page
 */
export const Privacy: SettingsStackScreen<"Privacy"> = () => {
    const { loggedIn } = useContext(LoginContext)

    const { navigate } = useNavigation()

    const [showModalDeleteData, setShowModalDeletedata] = useState(false)

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
                if (loggedIn) setShowModalDeletedata(true)
            },
        },
    ]

    return (
        <>
            <ContentWrapperScroll title="Privacy">
                <View style={{ paddingTop: 32 }}>
                    {settingsList.map((setting, index) => {
                        return <SettingTile setting={setting} key={index} />
                    })}
                </View>
            </ContentWrapperScroll>
            <ModalConfirm
                text={
                    "Sicuro/a di voler cancellare l'account?\n Quest'azione è irreversibile."
                }
                isShowing={showModalDeleteData}
                onClose={() => setShowModalDeletedata(false)}
                onOK={async () => {
                    if (loggedIn) {
                        await api.user.deletePoliNetworkMe()
                        await client.destroyTokens()
                    }
                    setShowModalDeletedata(false)
                }}
            />
        </>
    )
}
