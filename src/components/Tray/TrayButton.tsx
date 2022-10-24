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

    const icon = trayIcons[props.label]
    const iconSVG = useSVG(icon.svg)

    return (
        <Pressable
            onPress={props.onClick}
            style={{
                marginHorizontal: 20,
                marginLeft: 0,
            }}
        >
            <Canvas
                style={{
                    width: icon.width,
                    height: icon.heigth,
                }}
            >
                {iconSVG && (
                    <ImageSVG
                        svg={iconSVG}
                        x={0}
                        y={0}
                        width={icon.width}
                        height={icon.heigth}
                    />
                )}
            </Canvas>
        </Pressable>
    )
}
