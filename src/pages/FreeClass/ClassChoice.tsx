import { MainStackScreen } from "navigation/NavigationTypes"
import React from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { Title, BodyText } from "components/Text"
import { NavBar } from "components/NavBar"
import { FreeClassList } from "components/FreeClass/FreeClassList"

export const ClassChoice: MainStackScreen<"ClassChoice"> = props => {
    const { background, homeBackground } = usePalette()

    const { building } = props.route.params

    return (
        <View
            style={{
                flex: 1,
                alignItems: "stretch",
                backgroundColor: homeBackground,
            }}
        >
            <View
                style={{
                    flex: 1,
                    marginTop: 106,
                }}
            >
                <View
                    style={{
                        paddingBottom: 400,
                        backgroundColor: background,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,

                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.43,
                        shadowRadius: 9.51,

                        elevation: 15,
                    }}
                >
                    <View
                        //view containing the title
                        style={{
                            paddingHorizontal: 28,
                            marginTop: 28,
                            marginBottom: 17,
                        }}
                    >
                        <Title style={{ fontSize: 40, fontWeight: "900" }}>
                            {building}
                        </Title>
                    </View>
                    <View
                        //this view is for the date and the time
                        style={{
                            marginTop: 46,
                            marginBottom: 20,
                            backgroundColor: "red",
                            width: 260,
                            height: 27,
                            alignSelf: "center",
                        }}
                    >
                        <BodyText>Data Picker</BodyText>
                    </View>
                    <View style={{ paddingBottom: 70 }}>
                        <FreeClassList />
                    </View>
                </View>
            </View>
            <NavBar />
        </View>
    )
}
