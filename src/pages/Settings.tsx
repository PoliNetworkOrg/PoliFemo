import React, { useContext, useEffect, useState } from "react"
import { View } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { SettingsScroll } from "components/Settings"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings"
import { settingsIcons } from "assets/settings"
import { UserDetailsTile } from "components/Settings"
import { Setting } from "components/Settings"
import { ModalCustomSettings } from "components/Settings"
import { CourseTile } from "components/Settings"
import { SelectTile } from "components/Settings"
import { AppContext } from "../state/AppContext"
import { RadioButtonGroup } from "components/Settings"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { UserAnonymousTile } from "components/Settings"

const themes: string[] = ["Predefinito", "Scuro", "Chiaro"]
const themesToSave: string[] = ["predefined", "dark", "light"]

/**
 * Settings Page
 */
export const SettingsPage: SettingsStackScreen<"Settings"> = props => {
    const user = props.route.params.user

    const state = useContext(AppContext).state

    //App state theme
    const theme = state.theme
    //App state theme setter
    const setTheme = state.setTheme

    //RadioButtonGroup theme state and setter
    const [selectedTheme, setSelectedTheme] = useState(theme)

    //RadioButtonGroup carriere state and setter
    const [carriera, setCarriera] = useState(
        user.carriere[0].matricola.toString()
    )

    //for testing logged in/out view
    const [logged, setLogged] = useState(false)

    const [isModalVisible, setModalVisible] = useState(false)
    const { navigate } = useNavigation()

    //Update storage as a side effect of app state change
    useEffect(() => {
        AsyncStorage.setItem("theme", JSON.stringify(theme)).catch(err =>
            console.log(err)
        )
        console.log("Set theme " + theme)
    }, [theme])

    const settingsList: Setting[] = [
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
                    <RadioButtonGroup value={carriera} setValue={setCarriera}>
                        {user.carriere?.map((carriera, index) => {
                            return (
                                <CourseTile
                                    key={index}
                                    matricola={carriera.matricola}
                                    type={carriera.type}
                                />
                            )
                        })}
                    </RadioButtonGroup>
                )}
                <Divider />

                {settingsList.map((setting, index) => {
                    return <SettingTile setting={setting} key={index} />
                })}
            </SettingsScroll>
            <RadioButtonGroup value={selectedTheme} setValue={setSelectedTheme}>
                <ModalCustomSettings
                    title={"Scegli Tema"}
                    isShowing={isModalVisible}
                    selectedValue={selectedTheme}
                    onClose={() => {
                        //restore real theme value
                        setSelectedTheme(theme)
                        setModalVisible(false)
                    }}
                    onOK={(theme: string) => {
                        setTheme(theme)
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
            </RadioButtonGroup>
        </View>
    )
}
