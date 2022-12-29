import React, { FC } from "react"
import { FlexStyle, Pressable, View } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { RadioButtonCustom } from "./RadioButtonCustom"

export interface SelectTileProps {
    /**
     * if selected
     */
    selected: boolean
    /**
     * function called when a choice is selected
     */
    onPress: () => void
    /**
     * label shown on screen besides radio button if children is undefined
     */
    value?: string
    /**
     *flexstyle of row wrapper
     */
    flexStyle?: FlexStyle["justifyContent"]

    children?: React.ReactNode
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
                justifyContent: props.flexStyle ?? undefined,
                paddingVertical: 12,
                paddingLeft: 36,
                paddingRight: 36,
            }}
        >
            <Pressable onPress={props.onPress}>
                <RadioButtonCustom
                    status={props.selected}
                    darkColor={palette.darker}
                />
            </Pressable>
            <Pressable onPress={props.onPress}>
                {props.children ?? (
                    <View>
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
                    </View>
                )}
            </Pressable>
        </View>
    )
}
