import React, { useState, useContext } from "react"
import { TouchableOpacity, StyleSheet } from "react-native"

import { api } from "api"
import { HttpClient } from "api/HttpClient"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { PrivacyPage } from "components/Settings/PrivacyPage"
import { ModalWithButtons } from "components/ModalWithButtons"
import { Text, BodyText } from "components/Text"
import { DELETE_ACCOUNT, NOT_LOGGED_IN } from "utils/privacy"
import { usePalette } from "utils/colors"
import { LoginContext } from "utils/login"

const client = HttpClient.getInstance()

/**
 * Delete account Page
 */
export const DeleteAccount: SettingsStackScreen<"DeleteAccount"> = () => {
    const { buttonFill } = usePalette()
    const navigation = useNavigation()
    const { loggedIn } = useContext(LoginContext)

    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showFailureModal, setShowFailureModal] = useState(false)

    const deleteAccount = async () => {
        try {
            await api.user.deletePoliNetworkMe()
            await client.destroyTokens()
            setShowSuccessModal(true)
        } catch (err) {
            setShowFailureModal(true)
        }
    }

    return (
        <>
            <PrivacyPage
                title={"Cancella account"}
                text={loggedIn ? DELETE_ACCOUNT : NOT_LOGGED_IN}
                showContent={loggedIn}
                bottomComponent={
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
                }
            />

            <ModalWithButtons
                // Pops up when the account is successfully deleted
                isShowing={showSuccessModal}
                leftButtonTitle={"Esci"}
                rightButtonTitle={"Home"}
                onClose={() => setShowSuccessModal(false)}
                // TODO: forse se la tendina delle news era aperta, resta aperta
                onOK={() => {
                    setShowSuccessModal(false)
                    navigation.navigate("Home")
                }}
            >
                <BodyText style={styles.modalText}>
                    Account cancellato con successo.
                </BodyText>
            </ModalWithButtons>

            <ModalWithButtons
                // Pops up when the deletion of the account fails
                isShowing={showFailureModal}
                leftButtonTitle={"Esci"}
                rightButtonTitle={"Riprova"}
                onClose={() => setShowFailureModal(false)}
                onOK={() => {
                    setShowFailureModal(false)
                    deleteAccount()
                }}
            >
                <BodyText style={styles.modalText}>
                    Si è verificato un errore durante la cancellazione
                    dell'account.
                </BodyText>
            </ModalWithButtons>
        </>
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
    modalText: {
        marginTop: 30,
        marginBottom: 15,
        marginHorizontal: 20,
        fontSize: 18,
        fontWeight: "500",
    },
})
