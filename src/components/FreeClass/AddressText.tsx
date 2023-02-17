import React, { FC } from "react"
import { View, ActivityIndicator } from "react-native"
import { useSVG, Canvas, ImageSVG } from "@shopify/react-native-skia"
import PositionArrowIcon from "assets/freeClassrooms/positionArrow.svg"
import { BodyText } from "components/Text"
import { usePalette } from "utils/colors"
import { Platform } from "react-native"
import { LocationGeocodedAddress, PermissionStatus } from "expo-location"

interface AddressTextProps {
    currentLocation: LocationGeocodedAddress | undefined
    locationStatus: PermissionStatus
}


/**
 * This component represents the current address of the user, if it's available.
 * Otherwise:
 * - GPS enabled: there is an activity indicator
 * - GPS not enabled: there is a red text saying that the gps signal is missing
 */
export const AddressText: FC<AddressTextProps> = props => {
    const { background, isDark } = usePalette()
    const positionArrowSVG = useSVG(PositionArrowIcon)

    return (
        <View style={{ flexDirection: "row", marginTop: 19 }}>
            <View
                style={{
                    width: 25,
                    height: 25,
                    backgroundColor: background,
                }}
            >
                <Canvas
                    style={{
                        flex: 1,
                        width: 20,
                    }}
                >
                    {positionArrowSVG && (
                        <ImageSVG
                            svg={positionArrowSVG}
                            x={0}
                            y={0}
                            width={20}
                            height={20}
                        />
                    )}
                </Canvas>
            </View>
            <BodyText
                style={{
                    fontWeight: "900",
                    color: props.locationStatus === PermissionStatus.GRANTED
                        ? isDark
                            ? "white"
                            : "#454773"
                        : "red",
                    fontSize: 20,
                }}
            >
                {props.currentLocation === undefined ? (
                    props.locationStatus !== PermissionStatus.GRANTED ? (
                        "Segnale GPS mancante"
                    ) : (
                        <ActivityIndicator
                            style={{
                                marginTop: 5,
                                marginLeft: 5,
                            }}
                            size="small"
                        />
                    )
                ) : Platform.OS === "ios" ? (
                    props.currentLocation?.name +
                    ", " +
                    props.currentLocation?.city
                ) : (
                    props.currentLocation?.street +
                    " " +
                    props.currentLocation?.streetNumber +
                    ", " +
                    props.currentLocation?.city
                )}
            </BodyText>
        </View>
    )
}
