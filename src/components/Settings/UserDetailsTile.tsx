import React, { FC } from "react"
import { View, Image } from "react-native"
import { TouchableRipple } from "../TouchableRipple"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"

export interface UserDetailsTileProps {
    profilePic?: string
    nome?: string
    cognome?: string
    codPersona?: number
}

export const UserDetailsTile: FC<UserDetailsTileProps> = props => {
    const { isLight } = usePalette()
    return (
        <TouchableRipple isRoundedTopCorners={true}>
            <View
                style={{
                    paddingHorizontal: 28,
                    paddingTop: 30,
                    paddingBottom: 20,
                }}
            >
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View
                        style={{
                            width: 80,
                            height: 80,
                        }}
                    >
                        <Image
                            source={{
                                uri: props.profilePic,
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                                resizeMode: "cover",

                                borderRadius: 40,
                            }}
                        />
                    </View>
                    <View style={{ marginLeft: 14, paddingTop: 8 }}>
                        <Text
                            style={{
                                color: isLight ? "#000" : "#fff",
                                fontSize: 22,
                                fontWeight: "900",
                            }}
                        >
                            {props.nome} {props.cognome}
                        </Text>
                        <Text
                            style={{
                                color: isLight ? "#000" : "#fff",
                                fontSize: 16,
                                fontWeight: "400",
                            }}
                        >
                            Codice persona {props.codPersona}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableRipple>
    )
}
