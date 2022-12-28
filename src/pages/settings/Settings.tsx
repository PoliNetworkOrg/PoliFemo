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
import { Course } from "api/User"

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

    //actual course and setter. It will be moved in app state eventually.
    const [course, setCourse] = useState<Course>(user.courses[0])

    //currently selected course and setter.
    const [selectedCourse, setSelectedCourse] = useState<Course>(course)

    //for testing logged in/out view
    const [logged, setLogged] = useState(false)

    //control theme selector modal's visibility
    const [isModalThemeVisible, setModalThemeVisible] = useState(false)

    //control course selector modal's visibility
    const [isModalCourseVisible, setModalCourseVisible] = useState(false)

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
                        <CourseTile
                            course={course}
                            onPress={() => setModalCourseVisible(true)}
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
                isShowing={isModalCourseVisible}
                selectedValue={selectedCourse.matricola.toString()}
                onClose={() => {
                    //restore selectedCourse to course
                    setSelectedCourse(course)
                    setModalCourseVisible(false)
                }}
                onOK={() => {
                    //change course to selectedCourse
                    setCourse(selectedCourse)
                    setModalCourseVisible(false)
                }}
            >
                {user.courses?.map((courseOfIndex, index) => {
                    return (
                        <SelectTile
                            key={index}
                            value={courseOfIndex.matricola.toString()}
                            selected={
                                selectedCourse.matricola ===
                                courseOfIndex.matricola
                            }
                            onPress={() => {
                                setSelectedCourse(courseOfIndex)
                            }}
                        />
                    )
                })}
            </ModalCustomSettings>
        </View>
    )
}
