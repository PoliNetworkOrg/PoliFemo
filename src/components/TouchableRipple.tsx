import React, { FC } from "react"
import { View, TouchableNativeFeedback } from "react-native"
import { usePalette } from "utils/colors"

export interface TouchableRippleProps {
    onClick?: () => void
    isRoundedTopCorners?: boolean
    children: React.ReactNode
}

export const TouchableRipple: FC<TouchableRippleProps> = props => {
    const { isLight } = usePalette()
    return (
        <View
            style={[
                {
                    overflow: "hidden",
                },
                props.isRoundedTopCorners
                    ? {
                          borderTopLeftRadius: 30,
                          borderTopRightRadius: 30,
                      }
                    : {},
            ]}
        >
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(
                    isLight ? "#d2d2d2" : "#343E5A",
                    false
                )}
                style={{}}
                onPress={props.onClick ?? undefined}
            >
                {props.children}
            </TouchableNativeFeedback>
        </View>
    )
}
