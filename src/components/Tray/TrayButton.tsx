import React, { FC } from "react"
import { Pressable } from "react-native"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"

// import { usePalette } from "utils/colors"
import { TrayIcon, trayIcons } from "assets/tray"

export const TrayButton: FC<{
    onClick: () => void
    label: TrayIcon
}> = props => {
    // const { palette } = usePalette()
    // const color = palette.lighter

    const downloadsSVG = useSVG(trayIcons.downloads.svg)
    const notificationsSVG = useSVG(trayIcons.notifications.svg)
    const settingsSVG = useSVG(trayIcons.settings.svg)

    return (
        <Pressable
            onPress={props.onClick}
            style={{
                marginHorizontal: 20,
                marginLeft: 0,
            }}
        >
            {props.label === "downloads" ? (
                <Canvas
                    style={{
                        width: trayIcons.downloads.width,
                        height: trayIcons.downloads.heigth,
                    }}
                >
                    {downloadsSVG && (
                        <ImageSVG
                            svg={downloadsSVG}
                            x={0}
                            y={0}
                            width={trayIcons.downloads.width}
                            height={trayIcons.downloads.heigth}
                        />
                    )}
                </Canvas>
            ) : props.label === "notifications" ? (
                <Canvas
                    style={{
                        width: trayIcons.notifications.width,
                        height: trayIcons.notifications.heigth,
                    }}
                >
                    {notificationsSVG && (
                        <ImageSVG
                            svg={notificationsSVG}
                            x={0}
                            y={0}
                            width={trayIcons.notifications.width}
                            height={trayIcons.notifications.heigth}
                        />
                    )}
                </Canvas>
            ) : (
                <Canvas
                    style={{
                        width: trayIcons.settings.width,
                        height: trayIcons.settings.heigth,
                    }}
                >
                    {settingsSVG && (
                        <ImageSVG
                            svg={settingsSVG}
                            x={0}
                            y={0}
                            width={trayIcons.settings.width}
                            height={trayIcons.settings.heigth}
                        />
                    )}
                </Canvas>
            )}
        </Pressable>
    )
}
