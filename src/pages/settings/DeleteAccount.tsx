import React, { useContext } from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"

import { api } from "api"
import { HttpClient } from "api/HttpClient"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Text, BodyText } from "components/Text"
import { DELETE_ACCOUNT, NOT_LOGGED_IN } from "utils/privacy"
import { usePalette } from "utils/colors"
import { LoginContext } from "utils/login"
import { getUsableScreenHeight } from "utils/height"

const client = HttpClient.getInstance()

/**
 * Delete account Page
 */
export const DeleteAccount: SettingsStackScreen<"DeleteAccount"> = () => {
    const { buttonFill } = usePalette()
    const { loggedIn } = useContext(LoginContext)

    const deleteAccount = async () => {
        await api.user.deletePoliNetworkMe()
        await client.destroyTokens()
    }

    return (
        <ContentWrapperScroll title="Cancella account">
            {!loggedIn ? (
                <BodyText style={styles.text}>{NOT_LOGGED_IN}</BodyText>
            ) : (
                <View
                    style={{
                        justifyContent: "space-between",
                    }}
                >
                    <BodyText style={styles.text}>{DELETE_ACCOUNT}</BodyText>
                    <TouchableOpacity
                        onPress={deleteAccount}
                        activeOpacity={0.8}
                        style={[
                            styles.button,
                            {
                                backgroundColor: buttonFill,
                            },
                        ]}
                    >
                        <Text>Conferma</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ContentWrapperScroll>
    )
}

const styles = StyleSheet.create({
    text: {
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 30,
        minHeight: getUsableScreenHeight() - 280,
    },
    button: {
        height: 32,
        borderRadius: 16,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: 180,
    },
})
