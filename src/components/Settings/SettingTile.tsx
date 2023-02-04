import React, { FC, useMemo } from "react"
import { View } from "react-native"
import { TouchableRipple } from "../TouchableRipple"
import {
    BlendMode,
    Canvas,
    Group,
    ImageSVG,
    Skia,
    useSVG,
} from "@shopify/react-native-skia"
import { Text } from "components/Text"
import { Divider } from "components/Divider"
import { usePalette } from "utils/colors"
import { SettingOptions } from "contexts/settings"

export interface SettingTileProps {
    setting: SettingOptions
}

export const SettingTile: FC<SettingTileProps> = props => {
    const icon = props.setting.icon ?? null
    const iconSvg = useSVG(icon?.svg)
    const { isLight, palette } = usePalette()

    //changing icon color
    //from: https://github.com/Shopify/react-native-skia/issues/462
    const paint = useMemo(() => Skia.Paint(), [])
    paint.setColorFilter(
        Skia.ColorFilter.MakeBlend(
            Skia.Color(isLight ? palette.primary : palette.lighter),
            BlendMode.SrcIn
        )
    )

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
                    {iconSvg && icon && (
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
                                    width: icon?.width,
                                    height: icon?.heigth,
                                }}
                            >
                                <Group layer={paint}>
                                    <ImageSVG
                                        svg={iconSvg}
                                        x={0}
                                        y={0}
                                        width={icon.width}
                                        height={icon.heigth}
                                    />
                                </Group>
                            </Canvas>
                        </View>
                    )}

                    <View style={{ marginLeft: icon ? 20 : 0 }}>
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
