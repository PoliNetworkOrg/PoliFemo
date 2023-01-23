import { Divider } from "components/Divider"
import { BodyText } from "components/Text"
import React, { FC } from "react"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"

export interface GroupTileProps {
    name?: string
    link?: string
    onClick?: () => void
}

export const GroupTile: FC<GroupTileProps> = props => {
    const { isLight } = usePalette()

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
                            backgroundColor: isLight ? "#454773" : "#fff",
                            height: 48,
                            width: 48,
                            marginRight: 8,
                        }}
                    />
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
                            {props.name}
                        </BodyText>

                        <BodyText
                            style={{
                                fontSize: 12,
                                fontWeight: "400",
                                color: isLight ? "#454773" : "#fff",
                            }}
                        >
                            -:- members
                        </BodyText>
                    </View>
                </View>
            </Pressable>
            <Divider color={"#8791BD"} height={1}></Divider>
        </View>
    )
}
