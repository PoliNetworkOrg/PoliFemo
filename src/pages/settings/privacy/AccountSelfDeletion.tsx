import React, { useContext } from "react"
import { TouchableOpacity, StyleSheet } from "react-native"

import { SettingsStackScreen } from "navigation/NavigationTypes"
import { PrivacyPage } from "components/Settings/PrivacyPage"
import { Text } from "components/Text"
import { ACCOUNT_SELF_DELETION, NOT_LOGGED_IN } from "utils/privacy"
import { LoginContext } from "contexts/login"
import { usePalette } from "utils/colors"

/**
 * Privacy policy Page
 */
export const AccountSelfDeletion: SettingsStackScreen<
    "AccountSelfDeletion"
> = () => {
    const { buttonFill } = usePalette()

    const { loggedIn } = useContext(LoginContext)

    return (
        <PrivacyPage
            title={"Autocancellazione account"}
            text={loggedIn ? ACCOUNT_SELF_DELETION : NOT_LOGGED_IN}
            showContent={loggedIn}
            bottomComponent={
                <TouchableOpacity
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
            }
        />
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
