import React, { FC } from "react"
import { View } from "react-native"
import { TouchableRipple } from "../TouchableRipple"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { RadioButtonCustom } from "./RadioButtonCustom"
import { RadioButtonContext } from "./RadioButtonContext"

export interface SelectModeTileProps {
    name?: string
    default?: boolean
    index: number
}

export const SelectModeTile: FC<SelectModeTileProps> = props => {
    const { isLight } = usePalette()
    return (
        <RadioButtonContext.Consumer>
            {context => {
                return (
                    <TouchableRipple
                        onClick={() => {
                            context.onValueChange(props.index)
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                paddingVertical: 10,
                                paddingLeft: 36,
                                paddingRight: 46,
                            }}
                        >
                            <RadioButtonCustom
                                status={props.index === context.value}
                            ></RadioButtonCustom>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: "400",
                                        color: isLight ? "#000" : "#fff",
                                        textAlign: "right",
                                    }}
                                >
                                    {props.name}
                                </Text>
                            </View>
                        </View>
                    </TouchableRipple>
                )
            }}
        </RadioButtonContext.Consumer>
    )
}
