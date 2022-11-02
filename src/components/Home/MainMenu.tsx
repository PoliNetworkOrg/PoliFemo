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

export const buttonsIconsToAdd: ButtonInterface[] = []

// ! the purpose of these props is to try ModalCustom
export interface MainMenuProps {
    /**
     * called when the modal to add features needs to be shown
     */
    onAddFeature: () => void
}

/**
 * the main menu of the app, an horizontal scroll view with the buttons to navigate to the different pages
 */
export const MainMenu: FC<MainMenuProps> = props => {
    const { navigate } = useNavigation()

    const [isFocused, set] = useState(false)
    return (
        <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 21 }}
        >
            {buttonsIcons.map(buttonIcon => (
                <MenuButton
                    // TODO: actual navigation
                    onPress={
                        buttonIcon.title == "Aggiungi"
                            ? () => {
                                  props.onAddFeature()
                                  isFocused && set(!isFocused)
                              }
                            : () => {
                                  navigate("Saluti", { defaultName: "ciao" })
                                  isFocused && set(!isFocused)
                              }
                    }
                    onLongPress={
                        buttonIcon.title != "Aggiungi"
                            ? () => {
                                  set(!isFocused) // (TO-DO: how to SET(FALSE) quando viene effettuato il click all'esterno del componente)
                              }
                            : () => ""
                    }
                    buttonIcon={buttonIcon}
                    isFocused={isFocused}
                    handleFeatures={() => {
                        buttonIcon.title != "Aggiungi" &&
                            buttonsIcons.splice(
                                buttonsIcons.indexOf(buttonIcon),
                                1
                            )
                        buttonsIconsToAdd.push(buttonIcon)
                        buttonsIconsToAdd.sort((a, b) => {
                            if (a.id < b.id) return -1
                            if (a.id > b.id) return 1
                            return 0
                        })
                    }}
                    key={"menu_" + buttonIcon.id}
                />
            ))}
        </ScrollView>
    )
}
