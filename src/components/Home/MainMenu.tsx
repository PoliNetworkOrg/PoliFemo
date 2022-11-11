import React, { FC, useEffect, useState } from "react"
import { ScrollView, View } from "react-native"

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

import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * the buttons and their features
 */
export const defaultIcons: ButtonInterface[] = [
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
export const MainMenu: FC<{ filter?: string }> = ({ filter }) => {
    const { navigate } = useNavigation()

    const [icons, setIcons] = useState<ButtonInterface[]>([...defaultIcons])
    const [iconsToAdd, setIconsToAdd] = useState<ButtonInterface[]>([])

    const [isModalVisible, setModalVisible] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        AsyncStorage.getItem("menu:icons")
            .then(iconJSON => {
                if (iconJSON) {
                    console.log("Loading menu icons from storage")
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const icons: number[] = JSON.parse(iconJSON)
                    setIcons(defaultIcons.filter(i => icons.includes(i.id)))
                    setIconsToAdd(
                        defaultIcons.filter(i => !icons.includes(i.id))
                    )
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        console.log("Saving menu icons to storage")
        AsyncStorage.setItem(
            "menu:icons",
            JSON.stringify(icons.map(i => i.id))
        ).catch(err => console.log(err))
    }, [icons])

    // divide iconsToAdd in triplets
    const triplets = iconsToAdd.reduce((acc, cur, i) => {
        if (i % 3 === 0) {
            acc.push([cur])
        } else {
            acc[acc.length - 1].push(cur)
        }
        return acc
    }, [] as ButtonInterface[][])

    return (
        <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 21, marginTop: 5 }}
        >
            <ModalCustom
                centerText={false}
                title={"Aggiungi features"}
                subTitle={"Personalizza la tua bacheca"}
                isShowing={isModalVisible}
                onClose={() => setModalVisible(false)}
            >
                <View
                    style={{
                        alignItems: "center",
                        marginTop: 6,
                    }}
                >
                    {triplets.map((triplet, i) => (
                        <View
                            key={"menu_add_row" + i}
                            style={{
                                flexDirection: "row",
                                marginVertical: 2,
                                width: 288,
                            }}
                        >
                            {triplet.map((buttonIcon, idx) => (
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
                                    key={"menu_add_icon" + buttonIcon.id}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            </ModalCustom>
            {icons
                .filter(
                    i =>
                        i.id === 9 ||
                        (filter
                            ? i.title
                                  .toLowerCase()
                                  .includes(filter.toLowerCase())
                            : true)
                )
                .map((buttonIcon, idx) => (
                    <MenuButton
                        onPress={() => {
                            if (isDeleting) setIsDeleting(false)
                            if (buttonIcon.id === 9) setModalVisible(true)
                            // TODO: actual navigation
                            if (!isDeleting && buttonIcon.id !== 9)
                                navigate("Saluti", { defaultName: "Ciao" })
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
