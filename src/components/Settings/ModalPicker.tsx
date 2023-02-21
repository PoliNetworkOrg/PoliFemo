import React, { useEffect } from "react"
import { ModalCustom } from "components/Modal"
import { Picker } from "@react-native-picker/picker"
import { ButtonCustom } from "components/Button"
import { View } from "react-native"
import { usePalette } from "utils/colors"

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
  const { bodyText, palette } = usePalette()
  const [selectedValue, setSelectedValue] = React.useState(
    props.selectedValue ?? props.elements[0].value
  )

  useEffect(() => {
    setSelectedValue(props.selectedValue ?? props.elements[0].value)
  }, [props.selectedValue, props.elements])

  return (
    <ModalCustom
      isShowing={props.isShowing}
      onClose={props.onClose}
      centerText={props.centerText}
      title={props.title}
      subTitle={props.subTitle}
    >
      <Picker
        style={{
          marginHorizontal: 16,
          color: bodyText,
        }}
        itemStyle={{
          color: bodyText,
        }}
        dropdownIconColor={palette.accent}
        selectedValue={selectedValue}
        onValueChange={itemValue => setSelectedValue(itemValue)}
      >
        {props.elements.map((element, idx) => (
          <Picker.Item
            key={`__modal-picker-item-${idx}`}
            label={element.label}
            value={element.value}
          />
        ))}
      </Picker>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "flex-end",
          marginBottom: 32,
          marginTop: 16,
        }}
      >
        <ButtonCustom
          light={true}
          text="Annulla"
          onPress={() => props.onClose()}
        />
        <ButtonCustom
          light={false}
          text="OK"
          onPress={() => props.onSelect(selectedValue)}
        />
      </View>
    </ModalCustom>
  )
}
