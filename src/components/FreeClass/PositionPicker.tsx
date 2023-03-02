import React, { FC, useEffect, useState } from "react"
import { View } from "react-native"
import { SelectList } from "react-native-dropdown-select-list"
import { usePalette } from "utils/colors"
import { HeadquarterItem } from "pages/FreeClass/HeadquarterChoice"

interface PositionPickerProps {
  headquarter: HeadquarterItem | undefined
  onPositionSelected: (campusName: string) => void
}

interface PickerItem {
  key: number
  value: string
  disabled?: boolean
}

/**
 * This component handles the searchbar with dropdown list. The list displays the campus that are near to the user.
 */
export const PositionPicker: FC<PositionPickerProps> = props => {
  const [selected, setSelected] = useState("")
  const { fieldBackground, isLight, primary, background } = usePalette()

  const [data, setData] = useState<PickerItem[]>([]) // the data must be displayed

  //non bellissimo
  useEffect(() => {
    //this function fills the "data" array
    const tempData = []
    if (props.headquarter !== undefined) {
      let cnt = 0
      tempData.push({
        key: cnt,
        value: props.headquarter.name.join(" "),
        disabled: true,
      })
      cnt += 1
      if (props.headquarter.campusList !== undefined) {
        for (const c of props.headquarter.campusList) {
          tempData.push({ key: cnt, value: c.name.join(" ") })
          cnt += 1
        }
      }
    }
    setData(tempData)
  }, [props.headquarter])

  return (
    <View
      style={{
        alignSelf: "center",
        marginTop: 46,
        marginBottom: 12,
        width: 285,
      }}
    >
      <SelectList
        data={data}
        setSelected={(val: React.SetStateAction<string>) => {
          setSelected(val)
        }}
        onSelect={() => props.onPositionSelected(selected)}
        save="value"
        maxHeight={180}
        placeholder="Campus più vicini a te"
        searchPlaceholder="Cerca"
        notFoundText="Nessun risultato"
        fontFamily="Roboto_400Regular"
        boxStyles={{
          borderRadius: 28,
          height: 45,
          backgroundColor: fieldBackground,
          borderWidth: 0,
        }}
        inputStyles={{
          fontSize: 15,
          color: primary,
        }}
        dropdownTextStyles={{
          fontSize: 15,
          color: primary,
          marginLeft: 20,
        }}
        disabledTextStyles={{
          fontSize: 17,
          color: isLight ? "gray" : "white",
        }}
        disabledItemStyles={{
          backgroundColor: background,
        }}
      />
    </View>
  )
}
