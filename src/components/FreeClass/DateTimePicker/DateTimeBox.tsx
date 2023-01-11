import React, { FC } from "react"
import { View } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"

export interface DateTimeBoxProps {
    value?: string
}
/**
 * custom box which contains a 2 digit number, used
 * inside {@link DateTimePicker}
 */
export const DateTimeBox: FC<DateTimeBoxProps> = props => {
    const { isLight } = usePalette()
    return (
        <View
            style={{
                width: 38,
                height: 27,
                borderColor: isLight ? "#454773" : "#fff",
                borderWidth: 0.5,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "400",
                    color: isLight ? "#454773" : "#fff",
                    opacity: 0.4,
                }}
            >
                {props.value}
            </Text>
        </View>
    )
}
