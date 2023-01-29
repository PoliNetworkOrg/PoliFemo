import React, { FC, useState } from "react"
import { View } from "react-native"
import { OutlinedButton } from "./OutlinedButton"
import { StyleSheet } from "react-native"
import { ModalSelection, SelectTile } from "components/Settings"
import { getNameFromMode, ValidModalType } from "utils/groups"

export interface FiltersProps {
    year: string
    setYear: (value: string) => void
    course: string
    setCourse: (value: string) => void
    type: string
    setType: (value: string) => void
    platform: string
    setPlatform: (value: string) => void
    forceSearch: () => void
}

interface ModalItemList {
    itemsToShow: string[]
    itemsToSave: string[]
}

const yearsList: ModalItemList = {
    itemsToShow: [ "2022/2023","2021/2022", "2020/2021", "2019/2020", "2018/2019"],
    itemsToSave: [ "2022/2023","2021/2022", "2020/2021", "2019/2020", "2018/2019"],
}
const coursesList: ModalItemList = {
    itemsToShow: ["Triennale", "Magistrale", "Ciclo unico"],
    itemsToSave: ["LT", "LM", "LU"],
}

const typesList: ModalItemList = {
    itemsToShow: ["Scuola", "Corso", "Extra"],
    itemsToSave: ["S", "C", "E"],
}

const platformsList: ModalItemList = {
    itemsToShow: ["Whatsapp", "Facebook", "Telegram"],
    itemsToSave: ["WA", "FB", "TG"],
}

//to avoid writing mistakes
const all = "Tutti"

export const Filters: FC<FiltersProps> = props => {
    //show or hide modal
    const [isModalShowing, setIsModalShowing] = useState(false)
    //type of modal: year - type - course - platform
    const [modalMode, setModalMode] = useState<ValidModalType>("year")
    //items to show inside modal
    const [modalItems, setModalItems] = useState<ModalItemList>(yearsList)
    //currently selected item inside modal
    const [selectedItem, setSelectedItem] = useState<string>(all)

    //update state when user taps "OK" in modal
    const updateSelectedFilter = () => {
        if (modalMode === "year") {
            props.setYear(selectedItem)
        } else if (modalMode === "course") {
            props.setCourse(selectedItem)
        } else if (modalMode === "platform") {
            props.setPlatform(selectedItem)
        } else {
            props.setType(selectedItem)
        }
    }
    //reset state on "reset"
    const reset = () => {
        props.setYear(all)
        props.setCourse(all)
        props.setType(all)
        props.setPlatform(all)
        props.forceSearch()
    }

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
                    isSelected={props.year !== all ? true : false}
                    onPress={() => {
                        setModalMode("year")
                        setModalItems(yearsList)
                        setSelectedItem(props.year)
                        setIsModalShowing(true)
                    }}
                />
                <OutlinedButton
                    text="Corso"
                    buttonStyle={[
                        styles.buttonRightMargin,
                        styles.buttonBottomMargin,
                    ]}
                    isSelected={props.course !== all ? true : false}
                    onPress={() => {
                        setModalMode("course")
                        setModalItems(coursesList)
                        setSelectedItem(props.course)
                        setIsModalShowing(true)
                    }}
                />
                <OutlinedButton
                    text="Tipo"
                    buttonStyle={styles.buttonBottomMargin}
                    isSelected={props.type !== all ? true : false}
                    onPress={() => {
                        setModalMode("type")
                        setModalItems(typesList)
                        setSelectedItem(props.type)
                        setIsModalShowing(true)
                    }}
                />
                <OutlinedButton
                    text="Piattaforma"
                    buttonStyle={styles.buttonRightMargin}
                    isSelected={props.platform !== all ? true : false}
                    onPress={() => {
                        setModalMode("platform")
                        setModalItems(platformsList)
                        setSelectedItem(props.platform)
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
                {modalItems?.itemsToShow.map((itemName, index) => {
                    return (
                        <SelectTile
                            key={index}
                            value={itemName}
                            selected={
                                selectedItem === modalItems.itemsToSave[index]
                            }
                            onPress={() => {
                                setSelectedItem(modalItems.itemsToSave[index])
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
