import React, { FC, useMemo } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"

import {
    BlendMode,
    Canvas,
    Group,
    ImageSVG,
    Skia,
    useSVG,
} from "@shopify/react-native-skia"
import tick from "assets/freeClassrooms/tick.svg"

interface RoomUtilsTileProps {
    name: string
    status?: boolean
}

export const RoomUtilsTile: FC<RoomUtilsTileProps> = props => {
    const { isLight } = usePalette()

    const tickSvg = useSVG(tick)

    const paintTick = useMemo(() => Skia.Paint(), [])
    paintTick.setColorFilter(
        Skia.ColorFilter.MakeBlend(
            Skia.Color(
                props.status
                    ? isLight
                        ? "#424967"
                        : "#8791BD"
                    : isLight
                    ? "#8791BD"
                    : "#424967"
            ),
            BlendMode.SrcIn
        )
    )

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
            }}
        >
            {tick && tickSvg && (
                <View
                    style={{
                        width: 15,
                        height: 15,
                        marginRight: 8,
                    }}
                >
                    <Canvas
                        style={{
                            flex: 1,
                            width: 15,
                            height: 15,
                        }}
                    >
                        <Group layer={paintTick}>
                            <ImageSVG
                                svg={tickSvg}
                                x={0}
                                y={0}
                                width={15}
                                height={15}
                            />
                        </Group>
                    </Canvas>
                </View>
            )}
            <BodyText
                style={{
                    fontSize: 13,
                    fontWeight: "400",
                    color: isLight ? "#414867" : "#fff",
                }}
            >
                {props.name}
            </BodyText>
        </View>
    )
}
