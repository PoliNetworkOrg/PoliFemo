import React, { FC } from "react"
import { Pressable } from "react-native"

import { usePalette } from "utils/colors"
import { SettingsSVG } from "assets/tray/Settings"
import { NotificationsSVG } from "assets/tray/Notifications"
import { DownloadsSVG } from "assets/tray/Downloads"

export const TrayButton: FC<{
    onClick: () => void
    label: "settings" | "notifications" | "downloads"
}> = props => {
    const { darkTheme } = usePalette()
    const color = darkTheme.buttonFill
    return (
        <Pressable
            onPress={props.onClick}
            style={{
                marginHorizontal: 20,
                marginLeft: 0,
            }}
        >
            {props.label === "settings" ? (
                <SettingsSVG color={color} />
            ) : props.label === "notifications" ? (
                <NotificationsSVG color={color} />
            ) : (
                <DownloadsSVG color={color} />
            )}
        </Pressable>
    )
}
