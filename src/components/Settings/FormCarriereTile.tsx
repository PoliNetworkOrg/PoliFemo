import React, { FC } from "react"
import { View } from "react-native"
import { TouchableRipple } from "../TouchableRipple"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { RadioButtonCustom } from "./RadioButtonCustom"
import { RadioButtonContext } from "./RadioButtonContext"

export interface CarrieraTileProps {
    matricola: number
    type?: string
    default?: boolean
    index: number
}

export const CarrieraTile: FC<CarrieraTileProps> = props => {
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
                                justifyContent: "space-between",
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
                                        fontSize: 16,
                                        fontWeight: "400",
                                        color: isLight ? "#000" : "#fff",
                                        textAlign: "right",
                                    }}
                                >
                                    Matricola {props.matricola}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: "400",
                                        color: isLight ? "#000" : "#fff",
                                        textAlign: "right",
                                    }}
                                >
                                    {props.type}
                                </Text>
                            </View>
                        </View>
                    </TouchableRipple>
                )
            }}
        </RadioButtonContext.Consumer>
    )
}
