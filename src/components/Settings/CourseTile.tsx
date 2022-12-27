import React, { FC } from "react"
import { View } from "react-native"
import { TouchableRipple } from "components/TouchableRipple"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { RadioButtonCustom } from "./RadioButtonCustom"

export interface CourseTileProps {
    matricola: number
    selected: boolean
    onPress: () => void
    type?: string
}

/**
 * Custom Tile component designed to show a "Course of studies".
 */
export const CourseTile: FC<CourseTileProps> = props => {
    const { isLight } = usePalette()
    return (
        <TouchableRipple onClick={props.onPress}>
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
                <RadioButtonCustom status={props.selected}></RadioButtonCustom>
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
}
