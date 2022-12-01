import React, { FC } from "react"
import { Dimensions, View } from "react-native"
import { TrayButton } from "./TrayButton"

/**
 * Top bar menu present in every page of the application, containing the
 * download, notifications and settings buttons.
 */
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
                paddingTop: 56,
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
