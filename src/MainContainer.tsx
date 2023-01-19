import React, { FC } from "react"
import { View } from "react-native"
import { Tray } from "components/Tray"
import { usePalette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"
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
                /* eslint-disable @typescript-eslint/naming-convention */
                onNotifications={() => {
                    navigate("RoomDetails", {
                        room: {
                            name: "2.5",
                            building: "2",
                            power: true,
                            link: "https://www7.ceda.polimi.it/spazi/spazi/controller/Aula.do?evn_init=espandi&idaula=2328",
                            room_id: 2328,
                            lat: 45.47889998740511,
                            long: 9.227246568702538,
                        },
                    })
                }}
                onSettings={() => {
                    navigate("SettingsNav", {
                        screen: "Settings",
                    })
                }}
            />
        </View>
    )
}
