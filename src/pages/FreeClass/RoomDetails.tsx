import { MainStackScreen } from "navigation/NavigationTypes"
import React, { useMemo } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { PageWrapper } from "components/FreeClass/ClassDetails/PageWrapper"
import { BodyText } from "components/Text"
import {
    useSVG,
    Canvas,
    ImageSVG,
    Skia,
    BlendMode,
    Group,
} from "@shopify/react-native-skia"
import tick from "assets/freeClassrooms/tick.svg"
import { InfoMapTile } from "components/FreeClass/ClassDetails/InfoMapTile"
import { TimeLeftTile } from "components/FreeClass/ClassDetails/TimeLeftTile"
/* eslint-disable @typescript-eslint/naming-convention */

export const RoomDetails: MainStackScreen<"RoomDetails"> = props => {
    const tickSvg = useSVG(tick)

    const { isLight } = usePalette()

    // funny how renaming it class breaks everything, because class is also a keyword
    const { room, startDate } = props.route.params

    const paint = useMemo(() => Skia.Paint(), [])
    paint.setColorFilter(
        Skia.ColorFilter.MakeBlend(
            Skia.Color(isLight ? "#414867" : "#fff"),
            BlendMode.SrcIn
        )
    )
    const paintTick = useMemo(() => Skia.Paint(), [])
    paintTick.setColorFilter(
        Skia.ColorFilter.MakeBlend(
            Skia.Color(isLight ? "#424967" : "#8791BD"),
            BlendMode.SrcIn
        )
    )
    return (
        <PageWrapper style={{ paddingHorizontal: 28, paddingBottom: 120 }}>
            <InfoMapTile
                address={room.address}
                building={room.building}
                capacity={room.capacity}
                roomName={room.name}
            />
            <TimeLeftTile startDate={startDate} />
            <View
                style={{
                    width: "100%",
                    height: 140,
                    backgroundColor: "#414867",
                    marginTop: 46,
                    marginBottom: 18,
                }}
            >
                <BodyText style={{ color: "#fff" }}>
                    Seziona affolamento
                </BodyText>
            </View>
            <View>
                <BodyText
                    style={{
                        fontSize: 20,
                        fontWeight: "900",
                        color: isLight ? "#414867" : "#fff",
                    }}
                >
                    Info Utili:
                </BodyText>
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
                        ribaltine / banco piccolo
                    </BodyText>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
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
                        prese per ogni postazione
                    </BodyText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                        aula informatizzata
                    </BodyText>
                </View>
            </View>
        </PageWrapper>
    )
}
