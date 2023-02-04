import React, { useState, useEffect, useContext } from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import * as Clipboard from "expo-clipboard"

import { api } from "api"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Text, BodyText } from "components/Text"
import { usePalette } from "utils/colors"
import { LoginContext } from "utils/login"

/**
 * Account data Settings Page
 */
export const AccountData: SettingsStackScreen<"AccountData"> = () => {
    const { buttonFill } = usePalette()
    const { loggedIn } = useContext(LoginContext)

    const [userData, setUserData] = useState({})

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await api.user.exportPoliNetworkMe()
            setUserData(response)
        }
        if (loggedIn) {
            fetchUserData().catch(err => console.log(err))
        }
    }, [])

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(JSON.stringify(userData, null, 2))
    }

    return (
        <ContentWrapperScroll title="Dati account">
            {!loggedIn && (
                <BodyText style={styles.text}>
                    Nessun dato presente nel database
                </BodyText>
            )}

            {Object.keys(userData).length > 0 && (
                <View style={{ flex: 1, alignItems: "center" }}>
                    <BodyText style={styles.text}>
                        {JSON.stringify(userData, null, 2)}
                    </BodyText>
                    <TouchableOpacity
                        onPress={copyToClipboard}
                        activeOpacity={0.6}
                        style={[
                            styles.button,
                            {
                                backgroundColor: buttonFill,
                            },
                        ]}
                    >
                        <Text>Copia negli appunti</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ContentWrapperScroll>
    )
}

const styles = StyleSheet.create({
    text: {
        paddingVertical: 40,
        paddingHorizontal: 30,
    },
    button: {
        height: 32,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: 180,
    },
})
