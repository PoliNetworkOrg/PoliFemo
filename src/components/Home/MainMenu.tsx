import React, { FC, useState } from "react"
import { ScrollView } from "react-native"

import { useNavigation } from "navigation/NavigationTypes"

import { MenuButton, ButtonInterface } from "./MenuButton"

import calendar from "assets/menu/calendar.svg"
import clock from "assets/menu/clock.svg"
import association from "assets/menu/association.svg"
import free_classrooms from "assets/menu/free_classrooms.svg"
import materials from "assets/menu/materials.svg"
import groups from "assets/menu/whatsapp.svg"
import marks from "assets/menu/marks.svg"
import grading_book from "assets/menu/grading_book.svg"
import tests from "assets/menu/tests.svg"
import add from "assets/menu/add.svg"
import { ModalCustom } from "components/Modal"

// import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * the buttons and their features
 */
export const buttonsIcons: ButtonInterface[] = [
    { id: 0, title: "Calendario", icon: calendar },
    { id: 1, title: "Orario Lezioni", icon: clock },
    { id: 2, title: "PoliAssociazioni", icon: association },
    { id: 3, title: "Aule Libere", icon: free_classrooms },
    { id: 4, title: "Materiali", icon: materials },
    { id: 5, title: "Gruppi WA", icon: groups },
    { id: 6, title: "Valutazioni", icon: marks },
    { id: 7, title: "Libretto", icon: grading_book },
    { id: 8, title: "Test e Prove", icon: tests },
    { id: 9, title: "Aggiungi", icon: add },
]

/**
 * the main menu of the app, an horizontal scroll view with the buttons to navigate to the different pages
 */
export const MainMenu: FC = () => {
    const { navigate } = useNavigation()

    const [icons, setIcons] = useState<ButtonInterface[]>([...buttonsIcons])
    const [iconsToAdd, setIconsToAdd] = useState<ButtonInterface[]>([])

    const [isModalVisible, setModalVisible] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    return (
        <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 21 }}
        >
            <ModalCustom
                centerText={false}
                title={"Aggiungi features"}
                subTitle={"Personalizza la tua bacheca"}
                isShowing={isModalVisible}
                onClose={() => setModalVisible(false)}
            >
                {iconsToAdd.map((buttonIcon, idx) => (
                    <MenuButton
                        onPress={() => {
                            // remove the icon from the list of icons to add
                            const newIconsToAdd = [...iconsToAdd]
                            newIconsToAdd.splice(idx, 1)
                            // add the icon back to the list of icons
                            const newIcons = [...icons, buttonIcon]
                            newIcons.sort((a, b) => a.id - b.id)

                            setIcons(newIcons)
                            setIconsToAdd(newIconsToAdd)
                        }}
                        buttonIcon={buttonIcon}
                        isDeleting={false}
                        key={"menu_" + buttonIcon.id}
                    />
                ))}
            </ModalCustom>
            {icons.map((buttonIcon, idx) => (
                <MenuButton
                    // TODO: actual navigation
                    onPress={() => {
                        if (isDeleting) setIsDeleting(false)
                        if (buttonIcon.id === 9) setModalVisible(true)
                        else navigate("Saluti", { defaultName: "Ciao" })
                    }}
                    onLongPress={() => {
                        if (buttonIcon.id !== 9) setIsDeleting(!isDeleting)
                    }}
                    buttonIcon={buttonIcon}
                    isDeleting={isDeleting}
                    onDelete={() => {
                        // remove the icon and add it to the list of icons to add
                        const newIcons = [...icons]
                        newIcons.splice(idx, 1)
                        setIcons(newIcons)
                        setIconsToAdd(
                            [...iconsToAdd, buttonIcon].sort(
                                (a, b) => a.id - b.id
                            )
                        )
                    }}
                    key={"menu_" + buttonIcon.id}
                />
            ))}
        </ScrollView>
    )
}
