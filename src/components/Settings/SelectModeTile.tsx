import React, { FC } from "react"
import { Pressable, View } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { RadioButtonCustom } from "./RadioButton/RadioButtonCustom"
import { RadioButtonContext } from "./RadioButton/RadioButtonContext"

export interface SelectModeTileProps {
    name?: string
    default?: boolean
    index: number
}

export const SelectModeTile: FC<SelectModeTileProps> = props => {
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
                            onPress={() => context.onValueChange(props.index)}
                        >
                            <RadioButtonCustom
                                status={props.index === context.value}
                                darkColor={palette.darker}
                            />
                        </Pressable>
                        <View>
                            <Pressable
                                onPress={() =>
                                    context.onValueChange(props.index)
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
                                    {props.name ?? "CIao"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )
            }}
        </RadioButtonContext.Consumer>
    )
}
