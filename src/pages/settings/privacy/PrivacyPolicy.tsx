import React from "react"
import { Linking, TouchableOpacity, StyleSheet } from "react-native"

import { SettingsStackScreen } from "navigation/NavigationTypes"
import { PrivacyPage } from "components/Settings/PrivacyPage"
import { Text } from "components/Text"
import { POLICY } from "utils/privacy"
import { usePalette } from "utils/colors"

/**
 * Privacy policy Page
 */
export const PrivacyPolicy: SettingsStackScreen<"PrivacyPolicy"> = () => {
    const { buttonFill } = usePalette()

    const policyUrl = "https://polinetwork.org/it/learnmore/privacy/"

    const navigateToPolicy = () => {
        Linking.openURL(policyUrl).catch(err => console.log(err))
    }

    return (
        <PrivacyPage
            title={"Informativa privacy"}
            text={POLICY}
            showContent={true}
            bottomComponent={
                <TouchableOpacity
                    onPress={navigateToPolicy}
                    activeOpacity={0.8}
                    style={[
                        styles.button,
                        {
                            backgroundColor: buttonFill,
                        },
                    ]}
                >
                    <Text>Vedi informativa privacy</Text>
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
