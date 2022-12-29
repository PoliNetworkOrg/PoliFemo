import React, { FC } from "react"
import { View } from "react-native"
import { Tray } from "components/Tray"
import { usePalette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"
import { mockedUser } from "api/User"
import { MainStack } from "navigation/MainStackNavigator"

/**
 * The Main Container.
 *
 * It's a view that wraps the pages of the Main Navigator
 */

export const MainContainer: FC = () => {
    const { homeBackground } = usePalette()

    const { navigate } = useNavigation()
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: homeBackground,
            }}
        >
            <MainStack />

            <Tray
                onDownloads={() => {
                    console.log("downloads")
                }}
                onNotifications={() => {
                    console.log("notifications")
                }}
                onSettings={() => {
                    navigate("SettingsNav", {
                        screen: "Settings",
                        params: { user: mockedUser },
                    })
                }}
            />
        </View>
    )
}
