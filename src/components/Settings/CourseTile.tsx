import React, { FC } from "react"
import { View } from "react-native"
import { TouchableRipple } from "../TouchableRipple"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { RadioButtonCustom } from "./RadioButton/RadioButtonCustom"
import { RadioButtonContext } from "./RadioButton/RadioButtonGroup"

export interface CourseTileProps {
    matricola: number
    type?: string
}

/**
 * Custom Tile component designed to show a "Course of studies".
 */
export const CourseTile: FC<CourseTileProps> = props => {
    const { isLight } = usePalette()
    return (
        <RadioButtonContext.Consumer>
            {context => {
                return (
                    <TouchableRipple
                        onClick={() => {
                            context.setValue(props.matricola.toString())
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
                                status={
                                    props.matricola.toString() === context.value
                                }
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
