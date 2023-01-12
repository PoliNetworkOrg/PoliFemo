import { RootStackScreen, useNavigation } from "navigation/NavigationTypes"
import React, { useState } from "react"
import { View, FlatList, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import { Title, BodyText } from "components/Text"
import { NavBar } from "components/NavBar"

export const BuildingChoice: RootStackScreen<"BuildingChoice"> = props => {
    const { palette, background, homeBackground } = usePalette()
    const { navigate } = useNavigation()

    const { campus } = props.route.params

    const [buildings, setBuildings] = useState<string[]>([
        "B1",
        "B2",
        "B3",
        "B4",
        "B5",
    ])

    const [refreshing, setRefreshing] = useState<boolean>(false)

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
                        {campus.name.length > 1 ? (
                            <Title
                                style={{
                                    fontSize: 40,
                                    fontWeight: "300",
                                    fontFamily: "Roboto_300Light",
                                }}
                            >
                                {campus.name[0]}
                                <Title
                                    style={{ fontSize: 40, fontWeight: "900" }}
                                >
                                    {" " + campus.name[1]}
                                </Title>
                            </Title>
                        ) : (
                            <Title style={{ fontSize: 40, fontWeight: "900" }}>
                                {campus.name}
                            </Title>
                        )}
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
                    <FlatList
                        refreshing={refreshing}
                        onRefresh={() => console.log("refreshing!")}
                        showsVerticalScrollIndicator={false}
                        style={{
                            marginTop: 26,
                            height: 700,
                        }}
                        numColumns={2}
                        columnWrapperStyle={{
                            justifyContent: "center",
                        }}
                        data={buildings}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Pressable
                                style={{
                                    backgroundColor: palette.primary,
                                    borderRadius: 12,
                                    width: "42%",
                                    height: 93,
                                    marginHorizontal: 9,
                                    marginVertical: 17,
                                    alignItems: "center",
                                }}
                                onPress={() =>
                                    navigate("ClassChoice", { building: item })
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
                                            fontWeight: "300",
                                            color: "white",
                                            fontSize: 36,
                                            textAlign: "center",
                                        }}
                                    >
                                        {item}
                                    </BodyText>
                                </View>
                            </Pressable>
                        )}
                    />
                </View>
            </View>
            <NavBar />
        </View>
    )
}
