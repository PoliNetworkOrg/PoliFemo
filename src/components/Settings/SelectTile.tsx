import React, { FC } from "react"
import { Pressable, View } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { RadioButtonCustom } from "./RadioButton/RadioButtonCustom"
import { RadioButtonContext } from "./RadioButton/RadioButtonGroup"

export interface SelectTileProps {
    /**
     * label shown on screen beside radio button
     */
    name: string
    /**
     * value who will be update RadioButton context state
     */
    storageValue: string
}

/**
 * A tile designed to use in conjunction with {@link RadioButtonGroup}
 */
export const SelectTile: FC<SelectTileProps> = props => {
    const { isLight, palette } = usePalette()
    return (
        <RadioButtonContext.Consumer>
            {context => {
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
                        <Pressable
                            onPress={() => context.setValue(props.storageValue)}
                        >
                            <RadioButtonCustom
                                status={props.storageValue === context.value}
                                darkColor={palette.darker}
                            />
                        </Pressable>
                        <View>
                            <Pressable
                                onPress={() =>
                                    context.setValue(props.storageValue)
                                }
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: "400",
                                        color: isLight ? "#000" : "#fff",
                                        textAlign: "left",
                                        paddingLeft: 16,
                                    }}
                                >
                                    {props.name}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )
            }}
        </RadioButtonContext.Consumer>
    )
}
