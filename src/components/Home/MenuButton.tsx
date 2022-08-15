import React, { FC } from "react"
import { Pressable, View } from "react-native"

import { BodyText } from "components/Text"
import { usePalette } from "utils/colors"
import Icon from "assets/menu/calendar.svg"

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
                    width: 85,
                    height: 70,
                    backgroundColor: color,
                    paddingVertical: 6,
                    marginHorizontal: 6,
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 10,
                }}
            >
                {/* <Image source={icon} style={{ height: 26, marginBottom: 4 }} /> */}
                <Icon width={40} />
                <BodyText
                    style={{
                        fontSize: 10,
                        color: "white",
                    }}
                >
                    {title}
                </BodyText>
            </View>
        </Pressable>
    )
}
