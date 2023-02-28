import React, { FC, useState } from "react"
import { View } from "react-native"
import { SelectList } from "react-native-dropdown-select-list"
import { usePalette } from "utils/colors"
import buildingCoordsJSON from "components/FreeClass/buildingCoords.json"

interface PositionPickerProps {
  onPositionSelected: (campusName: string) => void
}

export const PositionPicker: FC<PositionPickerProps> = props => {
  const [selected, setSelected] = useState("")
  const { fieldBackground, bodyText, isLight, primary, background } =
    usePalette()

  //un po brutto
  const data = []
  let cnt = 0
  for (const h of buildingCoordsJSON) {
    data.push({ key: cnt, value: h.name.join(" "), disabled: true })
    cnt += 1
    for (const c of h.campus) {
      data.push({ key: cnt, value: c.name.join(" ") })
      cnt += 1
    }
    cnt += 1
  }

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
        placeholder="Inserisci una posizione"
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
          color: bodyText,
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
