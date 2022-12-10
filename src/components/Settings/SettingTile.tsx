import { Setting } from "pages/SettingsPage"
import React, { FC } from "react"
import { View } from "react-native"
import { TouchableRipple } from "../TouchableRipple"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { Text } from "components/Text"
import { Divider } from "components/Divider"
import { usePalette } from "utils/colors"

export interface SettingTileProps {
    setting: Setting
}

export const SettingTile: FC<SettingTileProps> = props => {
    const icon = props.setting.icon
    const iconSvg = useSVG(icon.svg)
    const { isLight, palette } = usePalette()
    return (
        <View>
            {props.setting.title === "Disconnetti" && <Divider />}
            <TouchableRipple
                onClick={props.setting.callback ?? undefined}
                isRoundedTopCorners={false}
            >
                <View
                    style={{
                        paddingVertical: 22,
                        paddingHorizontal: 32,
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            width: 24, // max icon width
                            height: 24, // max icon height
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Canvas
                            style={{
                                flex: 1,
                                width: icon.width,
                                height: icon.heigth,
                            }}
                        >
                            {iconSvg && (
                                <ImageSVG
                                    svg={iconSvg}
                                    x={0}
                                    y={0}
                                    width={icon.width}
                                    height={icon.heigth}
                                />
                            )}
                        </Canvas>
                    </View>

                    <View style={{ marginLeft: 20 }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "400",
                                color: isLight ? "#000" : "#fff",
                            }}
                        >
                            {props.setting.title}
                        </Text>
                        {props.setting.subtitle && (
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: "400",
                                    color: isLight
                                        ? palette.primary
                                        : palette.lighter,
                                }}
                            >
                                {props.setting.subtitle}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableRipple>
        </View>
    )
}
