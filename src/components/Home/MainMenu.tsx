import React, { FC } from "react"
import { ScrollView } from "react-native"

import { useNavigation } from "navigation/NavigationTypes"

import { MenuButton } from "./MenuButton"

// TODO: pages should be defined in a more configurable way (in a single place, probably in navigation)
const pages = [
    "Calendario",
    "Orario Lezioni",
    "PoliAssociazioni",
    "AuleLibere",
    "Materiali Scaricabili",
    "Aggiungi",
]

// ! the purpose of these props is to try ModalCustom
export interface MainMenuProps {
    showModal: () => void
}

/**
 * the main menu of the app, an horizontal scroll view with the buttons to navigate to the different pages
 */
export const MainMenu: FC<MainMenuProps> = props => {
    const { navigate } = useNavigation()
    return (
        <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 21 }}
        >
            {pages.map(p => (
                <MenuButton
                    // TODO: actual navigation
                    onPress={
                        p == "Aggiungi"
                            ? () => {
                                  props.showModal()
                              }
                            : () => navigate("Saluti", { defaultName: "ciao" })
                    }
                    title={p}
                    key={"menu_" + p}
                />
            ))}
        </ScrollView>
    )
}
