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
import { RadioButtonGroup, ThemeSelectorContext } from "utils/radioButton"

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
    const [carriera, setCarriera] = useState(
        user.carriere[0].matricola.toString()
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
                    <RadioButtonGroup.Provider
                        value={{ value: carriera, setValue: setCarriera }}
                    >
                        {user.carriere?.map((carriera, index) => {
                            return (
                                <CourseTile
                                    key={index}
                                    matricola={carriera.matricola}
                                    type={carriera.type}
                                />
                            )
                        })}
                    </RadioButtonGroup.Provider>
                )}
                <Divider />

                {settingsList.map((setting, index) => {
                    return <SettingTile setting={setting} key={index} />
                })}
            </SettingsScroll>
            <ThemeSelectorContext.Provider
                value={{ theme: selectedTheme, setTheme: setSelectedTheme }}
            >
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
                    {themes?.map((theme, index) => {
                        return (
                            <SelectTile
                                key={index}
                                name={theme}
                                storageValue={themesToSave[index]}
                            />
                        )
                    })}
                </ModalCustomSettings>
            </ThemeSelectorContext.Provider>
        </View>
    )
}
