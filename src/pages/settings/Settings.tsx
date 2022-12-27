import React, { useContext, useState } from "react"
import { View } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { SettingsScroll } from "components/Settings"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings"
import { settingsIcons } from "assets/settings"
import { UserDetailsTile } from "components/Settings"
import { ModalCustomSettings } from "components/Settings"
import { CourseTile } from "components/Settings"
import { SelectTile } from "components/Settings"
import { UserAnonymousTile } from "components/Settings"
import {
    SettingOptions,
    SettingsContext,
    ValidColorSchemeName,
} from "utils/settings"

const themes: string[] = ["Predefinito", "Scuro", "Chiaro"]
const themesToSave: ValidColorSchemeName[] = ["predefined", "dark", "light"]

/**
 * Settings Page
 */
export const SettingsPage: SettingsStackScreen<"Settings"> = props => {
    const user = props.route.params.user

    const context = useContext(SettingsContext)

    const settings = context.settings
    const setSettings = context.setSettings

    //App state theme
    const theme = settings.theme
    //Settings setter

    //RadioButtonGroup theme state and setter
    const [selectedTheme, setSelectedTheme] =
        useState<ValidColorSchemeName>(theme)

    //RadioButtonGroup carriere state and setter
    const [selectedMatricola, setSelectedMatricola] = useState(
        user.carriere[0].matricola
    )

    //for testing logged in/out view
    const [logged, setLogged] = useState(false)

    const [isModalVisible, setModalVisible] = useState(false)

    const { navigate } = useNavigation()

    const settingsList: SettingOptions[] = [
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
                {logged ? (
                    <UserDetailsTile
                        codPersona={user.codPersona}
                        profilePic={user.profilePic}
                        nome={user.nome}
                        cognome={user.cognome}
                        onPress={() => setLogged(false)}
                    />
                ) : (
                    <UserAnonymousTile
                        showRipple={false}
                        onLogin={() => setLogged(true)}
                    />
                )}
                {logged && (
                    <View>
                        {user.carriere?.map((carriera, index) => {
                            return (
                                <CourseTile
                                    key={index}
                                    matricola={carriera.matricola}
                                    type={carriera.type}
                                    selected={
                                        selectedMatricola === carriera.matricola
                                    }
                                    onPress={() =>
                                        setSelectedMatricola(carriera.matricola)
                                    }
                                />
                            )
                        })}
                    </View>
                )}
                <Divider />

                {settingsList.map((setting, index) => {
                    return <SettingTile setting={setting} key={index} />
                })}
            </SettingsScroll>

            <ModalCustomSettings
                title={"Scegli Tema"}
                isShowing={isModalVisible}
                selectedValue={selectedTheme}
                onClose={() => {
                    //restore real theme value
                    setSelectedTheme(theme)
                    setModalVisible(false)
                }}
                onOK={() => {
                    setSettings({ ...settings, theme: selectedTheme })
                    setModalVisible(false)
                }}
            >
                {themes?.map((themeName, index) => {
                    return (
                        <SelectTile
                            key={index}
                            value={themeName}
                            selected={selectedTheme === themesToSave[index]}
                            onPress={() => {
                                setSelectedTheme(themesToSave[index])
                            }}
                        />
                    )
                })}
            </ModalCustomSettings>
        </View>
    )
}
