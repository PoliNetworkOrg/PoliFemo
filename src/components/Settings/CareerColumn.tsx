import React, { FC } from "react"
import { View } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { Career } from "api/User"

export interface CareerColumnProps {
    career: Career
}
/**
 * Column with two texts with proper formatting for showing a career
 *
 */
export const CareerColumn: FC<CareerColumnProps> = props => {
    const { isLight } = usePalette()
    return (
        <View>
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "400",
                    color: isLight ? "#000" : "#fff",
                    textAlign: "right",
                }}
            >
                Matricola {props.career.matricola}
            </Text>
            <Text
                style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: isLight ? "#000" : "#fff",
                    textAlign: "right",
                }}
            >
                {props.career.type}
            </Text>
        </View>
    )
}
