import React, { FC } from "react"
import { View } from "react-native"

export interface DividerProps {
    color?: string
    height?: number
}

export const Divider: FC<DividerProps> = props => {
    return (
        <View
            style={{
                backgroundColor: props.color ?? "#8791BD",
                height: props.height ?? 1,
                width: "100%",
            }}
        />
    )
}
