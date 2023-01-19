import { MainStackScreen } from "navigation/NavigationTypes"
import React, { useMemo } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { PageWrapper } from "components/FreeClass/ClassDetails/PageWrapper"
import { BodyText, Text } from "components/Text"
import {
    useSVG,
    Canvas,
    ImageSVG,
    Skia,
    BlendMode,
    Group,
} from "@shopify/react-native-skia"
import clock from "assets/freeClassrooms/clock.svg"
import tick from "assets/freeClassrooms/tick.svg"
/* eslint-disable @typescript-eslint/naming-convention */
export interface MockedClass {
    name: string
    building: string
    power: boolean
    link: string
    room_id: number
    lat: number
    long: number
}

export const RoomDetails: MainStackScreen<"RoomDetails"> = props => {
    const clockSvg = useSVG(clock)
    const tickSvg = useSVG(tick)

    const { isLight, primary } = usePalette()

    // funny how renaming it class breaks everything, because class is also a keyword
    const { room } = props.route.params

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
        <PageWrapper style={{ marginHorizontal: 28 }}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <View style={{ flexDirection: "column" }}>
                    <View
                        style={{
                            marginTop: 28,
                            flexDirection: "row",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 40,
                                fontWeight: "300",
                                color: isLight ? "#414867" : primary,
                            }}
                        >
                            {room.building}.
                        </Text>
                        <Text
                            style={{
                                fontSize: 40,
                                fontWeight: "900",
                                color: isLight ? "#414867" : primary,
                            }}
                        >
                            {room.name}
                        </Text>
                    </View>
                    <View style={{ marginTop: 14, marginBottom: 8 }}>
                        <BodyText
                            style={{
                                fontSize: 16,
                                fontWeight: "900",
                                color: isLight ? "#414867" : "#fff",
                            }}
                        >
                            Indirizzo :
                        </BodyText>
                        <BodyText
                            style={{
                                fontSize: 13,
                                fontWeight: "400",
                                color: isLight ? "#414867" : "#fff",
                            }}
                        >
                            bho
                        </BodyText>
                    </View>
                    <View>
                        <BodyText
                            style={{
                                fontSize: 16,
                                fontWeight: "900",
                                color: isLight ? "#414867" : "#fff",
                            }}
                        >
                            Capienza
                        </BodyText>
                        <BodyText
                            style={{
                                fontSize: 13,
                                fontWeight: "400",
                                color: isLight ? "#414867" : "#fff",
                            }}
                        >
                            bho
                        </BodyText>
                    </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                    <View
                        style={{
                            width: 100,
                            height: 100,
                            backgroundColor: isLight ? "#414867" : "#fff",
                            marginTop: 65,
                            borderRadius: 10,
                        }}
                    />

                    <View
                        style={{ flexDirection: "row", alignItems: "baseline" }}
                    >
                        <BodyText
                            style={{
                                fontSize: 13,
                                fontWeight: "400",
                                color: isLight ? "#414867" : "#fff",
                            }}
                        >
                            consulta la{" "}
                        </BodyText>
                        <BodyText
                            style={{
                                fontSize: 16,
                                fontWeight: "900",
                                color: isLight ? "#414867" : "#fff",
                            }}
                        >
                            mappa
                        </BodyText>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 14 }}>
                <BodyText
                    style={{
                        fontSize: 20,
                        fontWeight: "900",
                        color: isLight ? "#414867" : "#fff",
                    }}
                >
                    Libera:
                </BodyText>
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: 18,
                        justifyContent: "space-between",
                    }}
                >
                    <View>
                        <View style={{ flexDirection: "column" }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 8,
                                    width: 96,
                                }}
                            >
                                <BodyText
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "400",
                                        color: isLight ? "#414867" : "#fff",
                                        flex: 1,
                                        paddingRight: 12,
                                    }}
                                >
                                    Da
                                </BodyText>
                                <View
                                    style={{
                                        borderColor: isLight
                                            ? "#454773"
                                            : "#fff",
                                        borderWidth: 0.5,
                                        borderRadius: 5,
                                    }}
                                >
                                    <BodyText
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "400",
                                            color: isLight ? "#414867" : "#fff",
                                            paddingHorizontal: 2,
                                        }}
                                    >
                                        08 : 00
                                    </BodyText>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    width: 96,
                                }}
                            >
                                <BodyText
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "400",
                                        color: isLight ? "#414867" : "#fff",
                                        paddingRight: 12,
                                        flex: 1,
                                        textAlign: "right",
                                    }}
                                >
                                    A
                                </BodyText>
                                <View
                                    style={{
                                        borderColor: isLight
                                            ? "#454773"
                                            : "#fff",
                                        borderWidth: 0.5,
                                        borderRadius: 5,
                                    }}
                                >
                                    <BodyText
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "400",
                                            color: isLight ? "#414867" : "#fff",
                                            paddingHorizontal: 2,
                                        }}
                                    >
                                        08 : 00
                                    </BodyText>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View
                            style={{
                                borderColor: isLight ? "#454773" : "#fff",
                                borderWidth: 0.5,
                                flexDirection: "row",
                                borderRadius: 5,
                                width: 200,
                                height: 64,
                                alignItems: "center",
                            }}
                        >
                            {clock && clockSvg && (
                                <View
                                    style={{
                                        width: 42,
                                        height: 49,
                                        marginLeft: 12,
                                        marginRight: 16,
                                    }}
                                >
                                    <Canvas
                                        style={{
                                            flex: 1,
                                            width: 42,
                                            height: 49,
                                        }}
                                    >
                                        <Group layer={paintTick}>
                                            <ImageSVG
                                                svg={clockSvg}
                                                x={0}
                                                y={0}
                                                width={42}
                                                height={49}
                                            />
                                        </Group>
                                    </Canvas>
                                </View>
                            )}
                            <View>
                                <BodyText
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "300",
                                        color: isLight ? "#414867" : "#fff",
                                    }}
                                >
                                    Mancano:
                                </BodyText>
                                <BodyText
                                    style={{
                                        fontSize: 36,
                                        fontWeight: "700",
                                        color: isLight ? "#414867" : "#fff",
                                    }}
                                >
                                    2 h 23`&apos;`
                                </BodyText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
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
