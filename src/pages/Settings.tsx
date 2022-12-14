import React, { useContext, useState } from "react"
import { View } from "react-native"
import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import { SettingsScroll } from "components/Settings/SettingsScroll"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings/SettingTile"
import { settingsIcons } from "assets/settings"
import { UserDetailsTile } from "components/Settings/UserDetailsTile"
import { RadioButtonForm } from "components/Settings/RadioButton/RadioButtonForm"
import { Setting } from "components/Settings/Setting"
import { ModalCustomSettings } from "components/Settings/ModalSettings"
import { CarrieraTile } from "components/Settings/FormCarriereTile"
import { SelectModeTile } from "components/Settings/SelectModeTile"
import { AppContext } from "../context/state"

const themeMods: string[] = ["Predefinito", "Scuro", "Chiaro"]

/**
 * Settings Page
 */
export const SettingsPage: RootStackScreen<"Settings"> = props => {
    const user = props.route.params.user

    const theme = useContext(AppContext).state.theme
    const setTheme = useContext(AppContext).state.setTheme

    const [modalTheme, setModalTheme] = useState(theme)

    const [carriera, setCarriera] = useState(
        user.carriere[0].matricola.toString()
    )

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

    return (
        <View style={{ flex: 1 }}>
            <SettingsScroll title="Impostazioni">
                <UserDetailsTile
                    codPersona={user.codPersona}
                    profilePic={user.profilePic}
                    nome={user.nome}
                    cognome={user.cognome}
                />
                <RadioButtonForm
                    selectedValue={carriera}
                    setSelectedValue={setCarriera}
                >
                    {user.carriere?.map((carriera, index) => {
                        return (
                            <CarrieraTile
                                key={index}
                                matricola={carriera.matricola}
                                type={carriera.type}
                            />
                        )
                    })}
                </RadioButtonForm>
                <Divider />

                {settingsList.map((setting, index) => {
                    return <SettingTile setting={setting} key={index} />
                })}
            </SettingsScroll>
            <RadioButtonForm
                selectedValue={modalTheme}
                setSelectedValue={setModalTheme}
            >
                <ModalCustomSettings
                    centerText={true}
                    title={"Scegli Tema"}
                    isShowing={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    onOK={(theme: string) => {
                        setTheme(theme)
                        setModalVisible(false)
                    }}
                    selectedValue={modalTheme}
                >
                    {themeMods?.map((theme, index) => {
                        return <SelectModeTile key={index} name={theme} />
                    })}
                </ModalCustomSettings>
            </RadioButtonForm>
        </View>
    )
}
