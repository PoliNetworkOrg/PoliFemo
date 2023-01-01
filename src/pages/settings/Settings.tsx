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
import { CareerColumn } from "components/Settings"
import { LoginContext } from "utils/login"
import { client } from "api"
import { Career } from "api/user"

const themes: string[] = ["Predefinito", "Scuro", "Chiaro"]
const themesToSave: ValidColorSchemeName[] = ["predefined", "dark", "light"]

/**
 * Settings Page
 */
export const SettingsPage: SettingsStackScreen<"Settings"> = () => {
    //for testing logged in/out view
    const { loggedIn, userInfo } = useContext(LoginContext)
    const { settings, setSettings } = useContext(SettingsContext)
    const theme = settings.theme

    //RadioButtonGroup theme state and setter
    const [selectedTheme, setSelectedTheme] =
        useState<ValidColorSchemeName>(theme)

    //actual career and setter. It will be moved in app state eventually.
    const [career, setCareer] = useState<Career | undefined>(
        userInfo?.careers[0]
    )

    //currently selected career and setter.
    const [selectedCareer, setSelectedCareer] = useState<Career>(
        career ?? {
            matricola: "N/A",
            type: "Nessuna Carriera",
        }
    )

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
        {
            title: "Disconnetti",
            icon: settingsIcons.disconnect,
            callback: async () => {
                await client.destroyTokens()
            },
        },
    ]

    return (
        <View style={{ flex: 1 }}>
            <SettingsScroll title="Impostazioni">
                {loggedIn ? (
                    <UserDetailsTile user={userInfo} />
                ) : (
                    <UserAnonymousTile
                        showRipple={false}
                        onLogin={() => navigate("Login")}
                    />
                )}
                {loggedIn && (
                    <View>
                        <CareerTile
                            career={career ?? userInfo.careers[0]}
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
                selectedValue={selectedCareer.matricola}
                onClose={() => {
                    //restore selectedCareer to career
                    if (career) setSelectedCareer(career)
                    setModalCareerVisible(false)
                }}
                onOK={() => {
                    //change career to selectedCareer
                    setCareer(selectedCareer)
                    setModalCareerVisible(false)
                }}
            >
                {userInfo?.careers?.map((careerOfIndex, index) => {
                    return (
                        <SelectTile
                            key={index}
                            selected={
                                selectedCareer?.matricola ===
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
