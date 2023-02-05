import React, { FC } from "react"
import { StyleProp, View, ViewStyle } from "react-native"

export interface DividerProps {
    color?: string
    height?: number
    style?: StyleProp<ViewStyle>
}

export const Divider: FC<DividerProps> = props => {
    return (
        <View
            style={[
                {
                    backgroundColor: props.color ?? "#8791BD",
                    height: props.height ?? 1,
                    width: "100%",
                },
                props.style,
            ]}
        />
    )
}
