import {
    Canvas,
    DataSourceParam,
    ImageSVG,
    useSVG,
} from "@shopify/react-native-skia"
import { Divider } from "components/Divider"
import { BodyText } from "components/Text"
import React, { FC } from "react"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"

export interface GroupTileProps {
    text?: string
    icon?: { svg: DataSourceParam; width: number; heigth: number }
    members?: string
    onClick?: () => void
}

export const GroupTile: FC<GroupTileProps> = props => {
    const { isLight } = usePalette()

    const iconSvg = useSVG(props.icon?.svg)

    return (
        <View style={{ flex: 1 }}>
            <Pressable
                onPress={props.onClick}
                style={{
                    marginVertical: 20,
                    flex: 1,
                }}
            >
                <View style={{ flex: 1, flexDirection: "row", width: "100%" }}>
                    <View
                        style={{
                            borderRadius: 24,
                            backgroundColor: "transparent",
                            height: 48,
                            width: 48,
                            marginRight: 8,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {props.icon && iconSvg && (
                            <View
                                style={{
                                    width: props.icon.width,
                                    height: props.icon.heigth,
                                }}
                            >
                                <Canvas
                                    style={{
                                        width: props.icon.width,
                                        height: props.icon.heigth,
                                    }}
                                >
                                    {iconSvg && (
                                        <ImageSVG
                                            svg={iconSvg}
                                            x={0}
                                            y={0}
                                            width={props.icon.width}
                                            height={props.icon.heigth}
                                        />
                                    )}
                                </Canvas>
                            </View>
                        )}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "space-evenly",
                        }}
                    >
                        <BodyText
                            style={{
                                fontSize: 16,
                                fontWeight: "700",
                                color: isLight ? "#454773" : "#fff",
                            }}
                        >
                            {props.text}
                        </BodyText>

                        {props.members && (
                            <BodyText
                                style={{
                                    fontSize: 12,
                                    fontWeight: "400",
                                    color: isLight ? "#454773" : "#fff",
                                }}
                            >
                                {props.members} members
                            </BodyText>
                        )}
                    </View>
                </View>
            </Pressable>
            <Divider color={"#8791BD"} height={1}></Divider>
        </View>
    )
}
