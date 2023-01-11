import React, { FC, useEffect, useState } from "react"
import { View } from "react-native"
import { OutlinedButton } from "./OutlinedButton"
import { StyleSheet } from "react-native"
import { ModalSelection, SelectTile } from "components/Settings"
import { api } from "api"

/* export interface FiltersProps {
    prova?: string
} */

//This is a mess for now
const yearsList = ["2021/2022", "2020/2021", "2019/2020", "2018/2019"]
const coursesList = ["Triennale", "Magistrale", "Ciclo unico"]
const typesList = ["A", "B", "C", "bho"]
const platformsList = ["Telgram", "Watsapp", "Bho"]

const getNameFromMode = (mode: string) => {
    if (mode === "year") {
        return "Anno"
    } else if (mode === "course") {
        return "Corso"
    } else if (mode === "platform") {
        return "Piattaforma"
    } else {
        return "Tipo"
    }
}
export type ValidModalType = "year" | "course" | "type" | "platform"
const all = "Tutti"
export const Filters: FC = () => {
    //show or hide modal
    const [isModalShowing, setIsModalShowing] = useState(false)
    //type of modal: year - type - course - platform
    const [modalMode, setModalMode] = useState<ValidModalType>("year")
    //items to show inside modal
    const [modalItems, setModalItems] = useState<string[]>(yearsList)
    //currently selected item inside modal
    const [selectedItem, setSelectedItem] = useState(all)

    const [year, setYear] = useState<string>(all)

    const [course, setCourse] = useState<string>(all)

    const [type, setType] = useState<string>(all)

    const [platform, setPlatform] = useState<string>(all)

    //update state when user taps "OK" in modal
    const updateSelectedFilter = () => {
        if (modalMode === "year") {
            setYear(selectedItem)
        } else if (modalMode === "course") {
            setCourse(selectedItem)
        } else if (modalMode === "platform") {
            setPlatform(selectedItem)
        } else {
            setType(selectedItem)
        }
    }
    //reset state on "reset"
    const reset = () => {
        setYear(all)
        setCourse(all)
        setType(all)
        setPlatform(all)
    }

    const searchGroups = async () => {
        try {
            //broken
            const response = await api.groups.get({ name: "Informatica" })
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        void searchGroups()
    }, [])
    return (
        <View>
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    paddingHorizontal: 10,
                }}
            >
                <OutlinedButton
                    text="Anno"
                    buttonStyle={[
                        styles.buttonRightMargin,
                        styles.buttonBottomMargin,
                    ]}
                    isSelected={year !== all ? true : false}
                    onPress={() => {
                        setModalMode("year")
                        setModalItems(yearsList)
                        setSelectedItem(year)
                        setIsModalShowing(true)
                    }}
                />
                <OutlinedButton
                    text="Corso"
                    buttonStyle={[
                        styles.buttonRightMargin,
                        styles.buttonBottomMargin,
                    ]}
                    isSelected={course !== all ? true : false}
                    onPress={() => {
                        setModalMode("course")
                        setModalItems(coursesList)
                        setSelectedItem(course)
                        setIsModalShowing(true)
                    }}
                />
                <OutlinedButton
                    text="Tipo"
                    buttonStyle={styles.buttonBottomMargin}
                    isSelected={type !== all ? true : false}
                    onPress={() => {
                        setModalMode("type")
                        setModalItems(typesList)
                        setSelectedItem(type)
                        setIsModalShowing(true)
                    }}
                />
                <OutlinedButton
                    text="Piattaforma"
                    buttonStyle={styles.buttonRightMargin}
                    isSelected={platform !== all ? true : false}
                    onPress={() => {
                        setModalMode("platform")
                        setModalItems(platformsList)
                        setSelectedItem(platform)
                        setIsModalShowing(true)
                    }}
                />
                <OutlinedButton
                    text="Reset"
                    isSpecial={true}
                    buttonStyle={{ minWidth: 48 }}
                    onPress={reset}
                />
            </View>
            <ModalSelection
                title={getNameFromMode(modalMode)}
                isShowing={isModalShowing}
                onClose={() => {
                    setIsModalShowing(false)
                }}
                selectedValue={selectedItem}
                onOK={() => {
                    updateSelectedFilter()
                    setIsModalShowing(false)
                }}
            >
                <SelectTile
                    value={all}
                    selected={selectedItem === all}
                    onPress={() => {
                        setSelectedItem(all)
                    }}
                />
                {modalItems?.map((itemName, index) => {
                    return (
                        <SelectTile
                            key={index}
                            value={itemName}
                            selected={selectedItem === modalItems[index]}
                            onPress={() => {
                                setSelectedItem(modalItems[index])
                            }}
                        />
                    )
                })}
            </ModalSelection>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonRightMargin: {
        marginRight: 8,
    },
    buttonBottomMargin: {
        marginBottom: 8,
    },
})
