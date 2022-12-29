import React, { useContext, useState } from "react"
import { View } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { SettingsScroll } from "components/Settings"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings"
import { settingsIcons } from "assets/settings"
import { UserDetailsTile } from "components/Settings"
import { ModalCustomSettings } from "components/Settings"
import { CareerTile } from "components/Settings"
import { SelectTile } from "components/Settings"
import { UserAnonymousTile } from "components/Settings"
import {
    SettingOptions,
    SettingsContext,
    ValidColorSchemeName,
} from "utils/settings"
import { Career } from "api/User"
import { CareerColumn } from "components/Settings"

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

    //actual career and setter. It will be moved in app state eventually.
    const [career, setCareer] = useState<Career>(user.careers[0])

    //currently selected career and setter.
    const [selectedCareer, setSelectedCareer] = useState<Career>(career)

    //for testing logged in/out view
    const [logged, setLogged] = useState(false)

    //control theme selector modal's visibility
    const [isModalThemeVisible, setModalThemeVisible] = useState(false)

    //control career selector modal's visibility
    const [isModalCareerVisible, setModalCareerVisible] = useState(false)

    const { navigate } = useNavigation()

    const settingsList: SettingOptions[] = [
        {
            title: "Aspetto",
            subtitle: "Dark, light mode",
            icon: settingsIcons.modify,
            callback: () => {
                setModalThemeVisible(true)
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
                        <CareerTile
                            career={career}
                            onPress={() => setModalCareerVisible(true)}
                        />
                    </View>
                )}
                <Divider />

                {settingsList.map((setting, index) => {
                    return <SettingTile setting={setting} key={index} />
                })}
            </SettingsScroll>

            <ModalCustomSettings
                title={"Scegli Tema"}
                isShowing={isModalThemeVisible}
                selectedValue={selectedTheme}
                onClose={() => {
                    //restore real theme value
                    setSelectedTheme(theme)
                    setModalThemeVisible(false)
                }}
                onOK={() => {
                    setSettings({ ...settings, theme: selectedTheme })
                    setModalThemeVisible(false)
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
            <ModalCustomSettings
                title={"Cambia Matricola"}
                isShowing={isModalCareerVisible}
                selectedValue={selectedCareer.matricola.toString()}
                onClose={() => {
                    //restore selectedCareer to career
                    setSelectedCareer(career)
                    setModalCareerVisible(false)
                }}
                onOK={() => {
                    //change career to selectedCareer
                    setCareer(selectedCareer)
                    setModalCareerVisible(false)
                }}
            >
                {user.careers?.map((careerOfIndex, index) => {
                    return (
                        <SelectTile
                            key={index}
                            selected={
                                selectedCareer.matricola ===
                                careerOfIndex.matricola
                            }
                            onPress={() => {
                                setSelectedCareer(careerOfIndex)
                            }}
                            flexStyle={"space-between"}
                        >
                            <CareerColumn career={careerOfIndex}></CareerColumn>
                        </SelectTile>
                    )
                })}
            </ModalCustomSettings>
        </View>
    )
}
