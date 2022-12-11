import React, { FC } from "react"
import { View, TouchableNativeFeedback } from "react-native"
import { usePalette } from "utils/colors"

export interface TouchableRippleProps {
    onClick?: () => void
    children: React.ReactNode
    isRoundedTopCorners?: boolean
    showRipple?: boolean
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
                background={
                    props.showRipple
                        ? TouchableNativeFeedback.Ripple(
                              isLight ? "#d2d2d2" : "#343E5A",
                              false
                          )
                        : undefined
                }
                style={{}}
                onPress={props.onClick ?? undefined}
            >
                {props.children}
            </TouchableNativeFeedback>
        </View>
    )
}
