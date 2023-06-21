import React, { useEffect } from "react"
import { Modal } from "components/Modal"
import { useTranslation } from "react-i18next"
import { SelectTile } from "./Settings/SelectTile"
import { ScrollView } from "react-native-gesture-handler"

interface ModalPickerProps<T> {
  /**
   * whether ot not to show the modal
   * @default false
   * */
  isShowing: boolean
  /**
   * this function hides the modal by changing the state in the parent component
   * */
  onClose: () => void
  /**
   * whether ot not to center title and subtitle and apply different margins
   * @default false
   * */
  centerText?: boolean
  /**
   * title of the modal
   * */
  title: string
  /**
   * subtitle of the modal
   * */
  subTitle?: string
  /**
   * Picker elements
   * */
  elements: { value: T; label: string }[]
  /**
   * default value of the picker
   * */
  selectedValue?: T
  /**
   * function called when an element is selected
   * */
  onSelect: (value: T) => void
}

/**
 * Modal with a Picker component
 * */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function ModalPicker<T>(props: ModalPickerProps<T>) {
  const [selectedValue, setSelectedValue] = React.useState(
    props.selectedValue ?? props.elements[0].value
  )

  useEffect(() => {
    setSelectedValue(props.selectedValue ?? props.elements[0].value)
  }, [props.selectedValue, props.elements])

  const { t } = useTranslation(["common", "settings"])

  return (
    <Modal
      isShowing={props.isShowing}
      centerText={props.centerText}
      title={props.title}
      subTitle={props.subTitle}
      buttons={[
        {
          light: true,
          text: "" + t("cancel"),
          onPress: () => props.onClose(),
        },
        {
          text: "OK",
          onPress: () => props.onSelect(selectedValue),
        },
      ]}
    >
      <ScrollView style={{ minHeight: 100 }} alwaysBounceVertical={false}>
        {props.elements?.map((element, index) => {
          return (
            <SelectTile
              key={index}
              value={element.label}
              selected={selectedValue === props.elements[index].value}
              onPress={() => {
                setSelectedValue(props.elements[index].value)
              }}
            />
          )
        })}
      </ScrollView>
    </Modal>
  )
}
