import React, { FC } from "react"
import { TextInput, View } from "react-native"
import { usePalette } from "utils/colors"

/**
 * butterblablabla
 */
export const PoliSearchBar: FC = () => {
    const { palette } = usePalette()
    return (
        <View
            style={{
                marginVertical: 46,
                marginHorizontal: 52,
                borderRadius: 28,
                borderColor: palette.darker,
                borderStyle: "solid",
                borderWidth: 1,
            }}
        >
            <View
                style={{
                    marginVertical: 10,
                    marginLeft: 18,
                    flexDirection: "row",
                }}
            >
                <TextInput
                    autoCorrect={true}
                    placeholder="Cerca"
                    selectionColor={palette.darker}
                />
            </View>
        </View>
    )
}
