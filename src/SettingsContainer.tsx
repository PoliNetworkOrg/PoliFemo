import React, { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { SettingsStack } from "navigation/SettingsNavigator"

/**
 * The Settings Container.
 *
 * It's a view that wraps pages of the Settings Navigator
 */
export const SettingsContainer: FC = () => {
    const { homeBackground } = usePalette()

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: homeBackground,
            }}
        >
            <SettingsStack />
        </View>
    )
}
