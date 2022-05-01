import React from "react"
import { View, Text, Pressable } from "react-native"
import { RootStackScreen } from "../navigation/NavigationTypes"

export const Home: RootStackScreen<"Home"> = ({ navigation }) => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 36, fontWeight: "bold" }}>Polifemo</Text>
            <Pressable
                onPress={() => {
                    navigation.navigate("Saluti", { defaultName: "Mario" })
                }}
                style={{
                    margin: 10,
                    padding: 8,
                    backgroundColor: "#ddd",
                    borderRadius: 4,
                }}
            >
                <Text>Vai ai saluti</Text>
            </Pressable>
        </View>
    )
}
