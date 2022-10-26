import React, { FC } from "react"
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
const buttonsIcons: ButtonInterface[] = [
    { id: 0, title: "Calendario", icon: calendar, isDeleting: false },
    { id: 1, title: "Orario Lezioni", icon: clock, isDeleting: false },
    { id: 2, title: "PoliAssociazioni", icon: association, isDeleting: false },
    { id: 3, title: "Aule Libere", icon: free_classrooms, isDeleting: false },
    { id: 4, title: "Materiali", icon: materials, isDeleting: false },
    { id: 5, title: "Gruppi WA", icon: groups, isDeleting: false },
    { id: 6, title: "Valutazioni", icon: marks, isDeleting: false },
    { id: 7, title: "Libretto", icon: grading_book, isDeleting: false },
    { id: 8, title: "Test e Prove", icon: tests, isDeleting: false },
    { id: 9, title: "Aggiungi", icon: add, isDeleting: false },
]

/**
 * the main menu of the app, an horizontal scroll view with the buttons to navigate to the different pages
 */
export const MainMenu: FC = () => {
    const { navigate } = useNavigation()
    return (
        <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 21 }}
        >
            {buttonsIcons.map(buttonIcon => (
                <MenuButton
                    // TODO: actual navigation
                    onPress={() => navigate("Saluti", { defaultName: "ciao" })}
                    onLongPress={() => console.log("Bottone premuto a lungo")}
                    buttonIcon={buttonIcon}
                    key={"menu_" + buttonIcon.id}
                />
            ))}
        </ScrollView>
    )
}
