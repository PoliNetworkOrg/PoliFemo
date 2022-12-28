import React, { FC } from "react"
import { View } from "react-native"
import { TouchableRipple } from "components/TouchableRipple"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { Course } from "api/User"
import { ButtonCustom } from "./ButtonCustom"

export interface CourseTileProps {
    course: Course
    onPress: () => void
}

/**
 * Custom Tile component designed to show a "Course of studies"
 * and a button to open a modal.
 */
export const CourseTile: FC<CourseTileProps> = props => {
    const { isLight } = usePalette()
    return (
        <TouchableRipple>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                    paddingLeft: 28,
                    paddingRight: 46,
                }}
            >
                <ButtonCustom
                    onPress={props.onPress}
                    text={"Cambia matricola"}
                    buttonStyle={{ paddingHorizontal: 8 }}
                />
                <View>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "400",
                            color: isLight ? "#000" : "#fff",
                            textAlign: "right",
                        }}
                    >
                        Matricola {props.course.matricola}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "400",
                            color: isLight ? "#000" : "#fff",
                            textAlign: "right",
                        }}
                    >
                        {props.course.type}
                    </Text>
                </View>
            </View>
        </TouchableRipple>
    )
}
