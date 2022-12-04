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
import { useOutsideClick } from "utils/outsideClick"
import { api, RetryType } from "api"

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

type ButtonState = ButtonInterface & { shown: boolean }

/**
 * the main menu of the app, an horizontal scroll view with the buttons to navigate to the different pages
 */
export const MainMenu: FC<{ filter?: string }> = ({ filter }) => {
    const { navigate } = useNavigation()

    const [icons, setIcons] = useState<ButtonState[]>(
        defaultIcons.map(icon => ({ ...icon, shown: true }))
    )

    const [isModalVisible, setModalVisible] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const scrollView = useOutsideClick<ScrollView>(() => {
        setIsDeleting(false)
    }, isDeleting)

    useEffect(() => {
        scrollView.current?.scrollTo({ x: 0, y: 0, animated: true })
    }, [filter, scrollView])

    useEffect(() => {
        AsyncStorage.getItem("menu:icons")
            .then(iconJSON => {
                if (iconJSON) {
                    console.log("Loading menu icons from storage")
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const showns: number[] = JSON.parse(iconJSON)
                    setIcons(
                        icons.map(icon => ({
                            ...icon,
                            shown: showns.includes(icon.id),
                        }))
                    )
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        console.log("Saving menu icons to storage")
        AsyncStorage.setItem(
            "menu:icons",
            JSON.stringify(icons.filter(i => i.shown).map(i => i.id))
        ).catch(err => console.log(err))
    }, [icons])

    // divide iconsToAdd in triplets
    const triplets = icons
        .filter(i => !i.shown)
        .reduce((acc, cur, i) => {
            if (i % 3 === 0) {
                acc.push([cur])
            } else {
                acc[acc.length - 1].push(cur)
            }
            return acc
        }, [] as ButtonInterface[][])

    return (
        <ScrollView
            ref={scrollView}
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
                            {triplet.map(buttonIcon => (
                                <MenuButton
                                    onPress={() => {
                                        setIcons(
                                            icons.map(i =>
                                                i.id === buttonIcon.id
                                                    ? { ...i, shown: true }
                                                    : i
                                            )
                                        )
                                    }}
                                    buttonIcon={buttonIcon}
                                    isDeleting={false}
                                    key={"menu_add_icon" + buttonIcon.id}
                                    inMenu
                                />
                            ))}
                        </View>
                    ))}
                </View>
            </ModalCustom>
            {icons
                .filter(i => i.shown)
                .filter(
                    i =>
                        i.id === 9 ||
                        (filter
                            ? i.title
                                  .toLowerCase()
                                  .includes(filter.toLowerCase())
                            : true)
                )
                .map(buttonIcon => (
                    <MenuButton
                        onPress={() => {
                            if (isDeleting) setIsDeleting(false)
                            if (buttonIcon.id === 9) setModalVisible(true)
                            // TODO: actual navigation
                            if (!isDeleting && buttonIcon.id !== 9) {
                                //ARTICLE EXAMPLE
                                /* navigate("Article", {
                                    article: {
                                        title: "Il Politecnico di Milano è partner del progetto ANSELMUS",
                                        subtitle:
                                            "Il prestigioso riconoscimento assegnato dalla Società Chimica Italiana",
                                        latitude: undefined,
                                        longitude: undefined,
                                        // eslint-disable-next-line @typescript-eslint/naming-convention
                                        publish_time:
                                            "2022-11-18T15:02:17.000Z",
                                        // eslint-disable-next-line @typescript-eslint/naming-convention
                                        target_time: undefined,
                                        content:
                                            // eslint-disable-next-line prettier/prettier, quotes
                                            '["<strong>TU Delft University of Technology</strong>, <strong>Gdańsk University of Technology </strong>e <strong>ETH Zurich</strong> si uniscono alla Alleanza ENHANCE&nbsp;nel suo percorso verso un’università europea.&nbsp;","L’Alleanza ENHANCE&nbsp;è lieta di dare il benvenuto a TU Delft University of Technology (Paesi Bassi), Gdańsk University of Technology (Polonia) e ETH Zurich (Svizzera) come nuovi membri.&nbsp;<br />Rappresentanti di alto livello di tutte e tre le istituzioni hanno aderito al ENHANCE Leadership Meeting, tenutosi venerdì 25 novembre 2022 presso l’RWTH .&nbsp;","Per maggiori informazioni: <a href=\\"https://enhanceuniversity.eu/\\" target=\\"_blank\\" rel=\\"noreferrer\\">https://enhanceuniversity.eu/</a>&nbsp;","<strong>TU Delft University of Technology</strong>, <strong>Gdańsk University of Technology </strong>e <strong>ETH Zurich</strong> si uniscono alla Alleanza ENHANCE&nbsp;nel suo percorso verso un’università europea.&nbsp;","L’Alleanza ENHANCE&nbsp;è lieta di dare il benvenuto a TU Delft University of Technology (Paesi Bassi), Gdańsk University of Technology (Polonia) e ETH Zurich (Svizzera) come nuovi membri.&nbsp;<br />Rappresentanti di alto livello di tutte e tre le istituzioni hanno aderito al ENHANCE Leadership Meeting, tenutosi venerdì 25 novembre 2022 presso l’RWTH .&nbsp;","Per maggiori informazioni: <a href=\\"https://enhanceuniversity.eu/\\" target=\\"_blank\\" rel=\\"noreferrer\\">https://enhanceuniversity.eu/</a>&nbsp;"]',
                                        image: "https://polimi.it/fileadmin/user_upload/HOME/Slider-evidenza/Copertine/maestri_500x320.jpg",
                                        author: {
                                            name: "Politecnico di Milano",
                                            link: "https://polimi.it",
                                            image: "https://upload.wikimedia.org/wikiFpedia/it/b/be/Logo_Politecnico_Milano.png",
                                        },
                                    },
                                }) */
                                navigate("Error404")
                            }
                        }}
                        onLongPress={() => {
                            if (buttonIcon.id !== 9) setIsDeleting(!isDeleting)
                        }}
                        buttonIcon={buttonIcon}
                        isDeleting={isDeleting}
                        onDelete={() => {
                            const { id } = buttonIcon
                            setIcons(
                                icons.map(i =>
                                    i.id === id ? { ...i, shown: false } : i
                                )
                            )
                        }}
                        key={"menu_" + buttonIcon.id}
                    />
                ))}
        </ScrollView>
    )
}
