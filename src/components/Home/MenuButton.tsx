import React, { FC } from "react"
import { Pressable, View, Image } from "react-native"
import { usePalette } from "../../utils/colors"

import { Text } from "../Text"

import icon from "../../../assets/menu/calendar.png"

/**
 * single buttons for the main menu, with custom icons and titles
 */
export const MenuButton: FC<{
    onPress: () => void
    title: string
}> = ({ onPress, title }) => {
    const { lightTheme } = usePalette()
    const color = lightTheme.buttonFill
    return (
        <Pressable onPress={onPress}>
            <View
                style={{
                    width: 75,
                    backgroundColor: color,
                    padding: 4,
                    margin: 8,
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 10,
                }}
            >
                <Image source={icon} style={{ height: 26, marginBottom: 4 }} />
                <Text
                    style={{
                        fontSize: 8,
                        color: "white",
                    }}
                >
                    {title}
                </Text>
            </View>
        </Pressable>
    )
}
