import React, { FC } from "react"
import { Pressable, View } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { RadioButtonCustom } from "./RadioButton/RadioButtonCustom"
import { RadioButtonContext } from "./RadioButton/RadioButtonContext"

export interface SelectModeTileProps {
    name: string
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
                            onPress={() => context.onValueChange(props.name)}
                        >
                            <RadioButtonCustom
                                status={props.name === context.value}
                                darkColor={palette.darker}
                            />
                        </Pressable>
                        <View>
                            <Pressable
                                onPress={() =>
                                    context.onValueChange(props.name)
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
