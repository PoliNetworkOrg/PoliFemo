import React, { FC } from "react"
import { Dimensions, View } from "react-native"
import { getStatusBarHeight } from "react-native-status-bar-height"
import { TrayButton } from "./TrayButton"

export const Tray: FC<{
    onDownloads: () => void
    onNotifications: () => void
    onSettings: () => void
}> = props => {
    return (
        <View
            style={{
                position: "absolute",
                padding: 5,
                paddingTop: getStatusBarHeight() + 12,
                flexDirection: "row",
                justifyContent: "flex-end",
                width: Dimensions.get("window").width,
            }}
        >
            <TrayButton label="downloads" onClick={() => props.onDownloads()} />
            <TrayButton
                label="notifications"
                onClick={() => props.onNotifications()}
            />
            <TrayButton label="settings" onClick={() => props.onSettings()} />
        </View>
    )
}
