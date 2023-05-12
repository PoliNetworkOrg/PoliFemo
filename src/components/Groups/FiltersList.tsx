import { FC, useState } from "react"
import { View } from "react-native"
import { OutlinedButton } from "./OutlinedButton"
import { StyleSheet } from "react-native"
import { getNameFromMode, ValidModalType } from "utils/groups"
import { Filters } from "utils/groups"
import { useTranslation } from "react-i18next"
import { ModalPicker } from "components/ModalPicker"
import { ItemToShow } from "../../interfaces/ItemToShow"
export interface FiltersProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
}

interface ModalItemList {
  itemsToShow: ItemToShow[]
  itemsToSave: string[]
}

const year = new Date().getFullYear()
const years = Array.from(
  new Array(5),
  (_, index) => year - index - 1 + "/" + (year - index)
)
const yearsList: ModalItemList = {
  itemsToShow: years.map(value => {
    return { value: value, label: value }
  }),
  itemsToSave: years,
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

  const { t } = useTranslation() //i18n hook

  const coursesList: ModalItemList = {
    itemsToShow: [
      { value: "bachelor", label: t("bachelor") },
      { value: "master", label: t("master") },
      { value: "single_cycle", label: t("single_cycle") },
    ],
    itemsToSave: ["LT", "LM", "LU"],
  }

  const typesList: ModalItemList = {
    itemsToShow: [
      { value: "school", label: t("school") },
      { value: "group_course", label: t("group_course") },
      { value: "Extra", label: t("Extra") },
    ],
    itemsToSave: ["S", "C", "E"],
  }

  const platformsList: ModalItemList = {
    itemsToShow: [
      { value: "Whatsapp", label: t("Whatsapp") },
      { value: "Facebook", label: t("Facebook") },
      { value: "Telegram", label: t("Telegram") },
    ],
    itemsToSave: ["WA", "FB", "TG"],
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
          text={"" + t("group_year")}
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
          text={"" + t("group_course")}
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
          text={"" + t("group_type")}
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
          text={"" + t("group_platform")}
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
      <ModalPicker
        title={"" + t(getNameFromMode(modalMode))}
        centerText
        isShowing={isModalShowing}
        elements={modalItems?.itemsToShow}
        selectedValue={selectedItem}
        onClose={() => setIsModalShowing(false)}
        onSelect={value => {
          const valueAsString = value?.toString()
          if (modalMode === "course") {
           
            props.onFilterChange({
              ...props.filters,
              course: valueAsString,
            })
          } else if (modalMode === "platform") {
            props.onFilterChange({
              ...props.filters,
              platform: valueAsString,
            })
          } else if (modalMode === "year") {
            props.onFilterChange({
              ...props.filters,
              year: valueAsString,
            })
          } else if (modalMode === "type") {
            props.onFilterChange({
              ...props.filters,
              type: valueAsString,
            })
          }
          setSelectedItem(valueAsString)
          setIsModalShowing(false)
        }}
      />
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
