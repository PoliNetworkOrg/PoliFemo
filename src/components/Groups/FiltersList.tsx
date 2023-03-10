import { FC, useState } from "react"
import { View } from "react-native"
import { OutlinedButton } from "./OutlinedButton"
import { StyleSheet } from "react-native"
import { SelectTile } from "components/Settings"
import { getNameFromMode, ValidModalType } from "utils/groups"
import { Filters } from "utils/groups"
import { Modal } from "components/Modal"
export interface FiltersProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
}

interface ModalItemList {
  itemsToShow: string[]
  itemsToSave: string[]
}

const yearsList: ModalItemList = {
  itemsToShow: [
    "2022/2023",
    "2021/2022",
    "2020/2021",
    "2019/2020",
    "2018/2019",
  ],
  itemsToSave: [
    "2022/2023",
    "2021/2022",
    "2020/2021",
    "2019/2020",
    "2018/2019",
  ],
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

export const FiltersList: FC<FiltersProps> = props => {
  //show or hide modal
  const [isModalShowing, setIsModalShowing] = useState(false)
  //type of modal: year - type - course - platform
  const [modalMode, setModalMode] = useState<ValidModalType>("year")
  //items to show inside modal
  const [modalItems, setModalItems] = useState<ModalItemList>(yearsList)
  //currently selected item inside modal
  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  )

  //reset state on "reset"
  const reset = () => {
    props.onFilterChange({})
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <OutlinedButton
          text="Anno"
          buttonStyle={styles.buttonCustomMargin}
          isSelected={props.filters.year ? true : false}
          onPress={() => {
            setModalMode("year")
            setModalItems(yearsList)
            setSelectedItem(props.filters.year)
            setIsModalShowing(true)
          }}
        />
        <OutlinedButton
          text="Corso"
          buttonStyle={styles.buttonCustomMargin}
          isSelected={props.filters.course ? true : false}
          onPress={() => {
            setModalMode("course")
            setModalItems(coursesList)
            setSelectedItem(props.filters.course)
            setIsModalShowing(true)
          }}
        />
        <OutlinedButton
          text="Tipo"
          buttonStyle={styles.buttonCustomMargin}
          isSelected={props.filters.type ? true : false}
          onPress={() => {
            setModalMode("type")
            setModalItems(typesList)
            setSelectedItem(props.filters.type)
            setIsModalShowing(true)
          }}
        />
        <OutlinedButton
          text="Piattaforma"
          buttonStyle={styles.buttonCustomMargin}
          isSelected={props.filters.platform ? true : false}
          onPress={() => {
            setModalMode("platform")
            setModalItems(platformsList)
            setSelectedItem(props.filters.platform)
            setIsModalShowing(true)
          }}
        />
        <OutlinedButton
          text="Reset"
          isSpecial={true}
          buttonStyle={[{ minWidth: 48 }, styles.buttonCustomMargin]}
          onPress={reset}
        />
      </View>
      <Modal
        title={getNameFromMode(modalMode)}
        centerText
        isShowing={isModalShowing}
        buttons={[
          {
            text: "Annulla",
            onPress: () => {
              setIsModalShowing(false)
            },
          },
          {
            text: "Conferma",
            onPress: () => {
              if (modalMode === "course") {
                props.onFilterChange({
                  ...props.filters,
                  course: selectedItem,
                })
              } else if (modalMode === "platform") {
                props.onFilterChange({
                  ...props.filters,
                  platform: selectedItem,
                })
              } else if (modalMode === "year") {
                props.onFilterChange({
                  ...props.filters,
                  year: selectedItem,
                })
              } else if (modalMode === "type") {
                props.onFilterChange({
                  ...props.filters,
                  type: selectedItem,
                })
              }
              setIsModalShowing(false)
            },
          },
        ]}
      >
        <SelectTile
          value={"Tutti"}
          selected={selectedItem === undefined}
          onPress={() => {
            setSelectedItem(undefined)
          }}
        />
        {modalItems?.itemsToShow.map((itemName, index) => {
          return (
            <SelectTile
              key={index}
              value={itemName}
              selected={selectedItem === modalItems.itemsToSave[index]}
              onPress={() => {
                setSelectedItem(modalItems.itemsToSave[index])
              }}
            />
          )
        })}
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonCustomMargin: {
    marginRight: 4,
    marginLeft: 4,
    marginBottom: 8,
  },
})
