import React, { useState, useEffect, useContext } from "react"
import { TouchableOpacity, StyleSheet } from "react-native"
import * as Clipboard from "expo-clipboard"

import { api } from "api"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { PrivacyPage } from "components/Settings/PrivacyPage"
import { Text, BodyText } from "components/Text"
import { ACCOUNT_DATA, NOT_LOGGED_IN } from "utils/privacy"
import { usePalette } from "utils/colors"
import { LoginContext } from "contexts/login"

/**
 * Account data Page
 */
export const AccountData: SettingsStackScreen<"AccountData"> = () => {
    const { buttonFill } = usePalette()
    const { loggedIn } = useContext(LoginContext)

    const [userData, setUserData] = useState({})

    //TODO: indicator mentre sto fetchando??

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
        <PrivacyPage
            title={"Dati account"}
            text={loggedIn ? ACCOUNT_DATA : NOT_LOGGED_IN}
            showContent={loggedIn}
            bottomComponent={
                <TouchableOpacity
                    onPress={copyToClipboard}
                    activeOpacity={0.8}
                    style={[
                        styles.button,
                        {
                            backgroundColor: buttonFill,
                        },
                    ]}
                >
                    <Text>Copia negli appunti</Text>
                </TouchableOpacity>
            }
        >
            {Object.keys(userData).length > 0 && (
                <BodyText>{JSON.stringify(userData, null, 2)}</BodyText>
            )}
        </PrivacyPage>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 32,
        borderRadius: 16,
        paddingHorizontal: 30,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
})
