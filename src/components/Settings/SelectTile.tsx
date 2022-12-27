import React, { FC } from "react"
import { Pressable, View } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { RadioButtonCustom } from "./RadioButtonCustom"

export interface SelectTileProps {
    /**
     * label shown on screen besides radio button
     */
    value: string
    /**
     * if selected
     */
    selected: boolean
    /**
     * function called when a choice is selected
     */
    onPress: () => void
}

/**
 * A tile designed for a radio button group.
 */
export const SelectTile: FC<SelectTileProps> = props => {
    const { isLight, palette } = usePalette()
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingLeft: 36,
                paddingRight: 46,
            }}
        >
            <Pressable onPress={props.onPress}>
                <RadioButtonCustom
                    status={props.selected}
                    darkColor={palette.darker}
                />
            </Pressable>
            <View>
                <Pressable onPress={props.onPress}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "400",
                            color: isLight ? "#000" : "#fff",
                            textAlign: "left",
                            paddingLeft: 16,
                        }}
                    >
                        {props.value}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}
