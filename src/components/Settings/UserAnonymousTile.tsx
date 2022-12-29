import React, { FC } from "react"
import { View, Image } from "react-native"
import { TouchableRipple } from "components/TouchableRipple"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { ButtonCustom } from "./ButtonCustom"

export interface UserAnonymousTileProps {
    onLogin?: () => void
    showRipple?: boolean
}

export const UserAnonymousTile: FC<UserAnonymousTileProps> = props => {
    const { isLight } = usePalette()
    return (
        <TouchableRipple
            isRoundedTopCorners={true}
            showRipple={props.showRipple}
        >
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
                            borderRadius: 40,
                            backgroundColor: "#D9D9D9",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Image
                            // ? remember to ask designers for svg format
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            source={require("assets/settings/user.png")}
                            style={{
                                resizeMode: "contain",
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            marginLeft: 14,
                            paddingTop: 8,
                            flexDirection: "column",
                        }}
                    >
                        <Text
                            style={{
                                color: isLight ? "#000" : "#fff",
                                fontSize: 22,
                                fontWeight: "900",
                            }}
                        >
                            Utente Anonimo
                        </Text>
                        <View style={{ alignSelf: "flex-end", marginTop: 42 }}>
                            <ButtonCustom
                                text="Login"
                                onPress={props.onLogin}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableRipple>
    )
}
