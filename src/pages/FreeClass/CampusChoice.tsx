import React, { useState } from "react"
import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View, Pressable, FlatList, Platform } from "react-native"
import { usePalette } from "utils/colors"
import { NavBar } from "components/NavBar"
import { Title, BodyText } from "components/Text"

export interface CampusItem {
    id: number
    name: string[]
}

export const CampusChoice: RootStackScreen<"CampusChoice"> = () => {
    const { navigate } = useNavigation()
    const { homeBackground, background, palette } = usePalette()

    const [refreshing, setRefreshing] = useState<boolean>(false)

    const [data, setData] = useState<CampusItem[]>([
        { id: 0, name: ["Bovisa", "Durando"] },
        { id: 1, name: ["Bovisa", "La Masa"] },
        { id: 2, name: ["Leonardo"] },
        { id: 3, name: ["Colombo"] },
        { id: 4, name: ["Mancinelli"] },
    ])

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
                        <Title style={{ fontSize: 40 }}>Campus</Title>
                    </View>
                    <View
                        //this view is for the date and the time
                        style={{
                            marginTop: 46,
                            backgroundColor: "red",
                            width: 260,
                            height: 27,
                            alignSelf: "center",
                        }}
                    >
                        <BodyText>Data Picker</BodyText>
                    </View>
                    <View style={{ paddingBottom: 35 }}>
                        <FlatList
                            showsVerticalScrollIndicator={true}
                            style={{
                                marginTop: 26,
                            }}
                            numColumns={2}
                            columnWrapperStyle={{
                                justifyContent: "center",
                            }}
                            data={data}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={{
                                        backgroundColor: palette.primary,
                                        borderRadius: 12,
                                        width: "42%",
                                        height: 93,
                                        marginHorizontal: 9,
                                        marginVertical: 27,
                                        alignItems: "center",
                                    }}
                                    onPress={() =>
                                        navigate("BuildingChoice", {
                                            campus: item,
                                        })
                                    }
                                >
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <BodyText
                                            style={{
                                                fontWeight:
                                                    item.name.length > 1
                                                        ? "300"
                                                        : "900",
                                                color: "white",
                                                fontSize: 20,
                                                textAlign: "center",
                                            }}
                                        >
                                            {item.name[0]}
                                        </BodyText>
                                        {item.name.length > 1 ? (
                                            <BodyText
                                                style={{
                                                    fontWeight: "900",
                                                    color: "white",
                                                    fontSize: 20,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {item.name[1]}
                                            </BodyText>
                                        ) : undefined}
                                    </View>
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            </View>
            <NavBar />
        </View>
    )
}
