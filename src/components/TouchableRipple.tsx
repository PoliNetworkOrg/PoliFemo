import React, { FC } from "react"
import { View, Pressable } from "react-native"
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
            <Pressable
                android_ripple={
                    props.showRipple === undefined || props.showRipple === true
                        ? { color: isLight ? "#d2d2d2" : "#343E5A" }
                        : undefined
                }
                onPress={props.onClick ?? undefined}
            >
                {props.children}
            </Pressable>
        </View>
    )
}
