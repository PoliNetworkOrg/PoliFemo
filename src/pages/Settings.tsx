import React, { useState } from "react"
import { ScrollView, View } from "react-native"
import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import { SettingsScroll } from "components/Settings/SettingsScroll"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings/SettingTile"
import { settingsIcons } from "assets/settings"
import { UserDetailsTile } from "components/Settings/UserDetailsTile"
import { RadioButtonForm } from "components/Settings/RadioButtonForm"
import { Setting } from "components/Settings/Setting"
import { Text } from "components/Text"
import { ModalCustomSettings } from "components/Settings/ModalSettings"
import { CarrieraTile } from "components/Settings/FormCarriereTile"
import { SelectModeTile } from "components/Settings/SelectModeTile"

/**
 * Settings Page
 */
export const SettingsPage: RootStackScreen<"Settings"> = props => {
    const [isModalVisible, setModalVisible] = useState(false)
    const { navigate } = useNavigation()
    const settingsList: Setting[] = [
        {
            title: "Notifiche",
            subtitle: "Toni messaggi, gruppi",
            icon: settingsIcons.notifiche,
            callback: () => {
                navigate("Notifications")
            },
        },
        {
            title: "Aspetto",
            subtitle: "Dark, light mode",
            icon: settingsIcons.modify,
            callback: () => {
                setModalVisible(true)
            },
        },
        {
            title: "Aiuto",
            subtitle: "Centro assistenza, contattaci, informativa privacy",
            icon: settingsIcons.help,
            callback: () => {
                navigate("Help")
            },
        },
        { title: "Disconnetti", icon: settingsIcons.disconnect },
    ]
    const user = props.route.params.user
    return (
        <SettingsScroll title="Settings">
            <UserDetailsTile
                codPersona={user.codPersona}
                profilePic={user.profilePic}
                nome={user.nome}
                cognome={user.cognome}
            ></UserDetailsTile>
            <RadioButtonForm>
                {user.carriere?.map((carriera, index) => {
                    return (
                        <CarrieraTile
                            key={index}
                            matricola={carriera.matricola}
                            type={carriera.type}
                            index={index}
                        />
                    )
                })}
            </RadioButtonForm>
            <Divider />

            {settingsList.map((setting, index) => {
                return <SettingTile setting={setting} key={index} />
            })}

            <ModalCustomSettings
                centerText={true}
                title={"Scegli Tema"}
                isShowing={isModalVisible}
                onClose={() => setModalVisible(false)}
            >
                <RadioButtonForm>
                    {user.carriere?.map((carriera, index) => {
                        return (
                            <SelectModeTile
                                key={index}
                                name={"prova"}
                                index={index}
                            />
                        )
                    })}
                </RadioButtonForm>
            </ModalCustomSettings>
        </SettingsScroll>
    )
}
