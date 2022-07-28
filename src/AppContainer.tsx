import React, { FC } from "react"
import { View } from "react-native"
import { Tray } from "./components/Tray"
import { RootStack } from "./navigation/RootStackNavigator"
import { usePalette } from "./utils/colors"

/**
 * The main app container.
 *
 * It's a view that wraps everything else, different from App.tsx cause that contains for non
 * structural components.
 */
export const AppContainer: FC = () => {
    const { homeBackground } = usePalette()
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: homeBackground,
            }}
        >
            <RootStack />
            <Tray
                onDownloads={() => {
                    console.log("downloads")
                }}
                onNotifications={() => {
                    console.log("notifications")
                }}
                onSettings={() => {
                    console.log("settings")
                }}
            />
        </View>
    )
}
