import React, { FC } from "react"
import { TextInput } from "react-native"
import { usePalette } from "utils/colors"

/**
 * butterblablabla
 */
export const PoliSearchBar: FC = () => {
    const { palette } = usePalette()
    return (
        <TextInput
            autoCorrect={true}
            placeholder="polifemo"
            textAlign="center"
            style={{
                backgroundColor: palette.lighter,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        />
    )
}
