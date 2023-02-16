import React, { useState } from "react"
import { Alert, View } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings/SettingTile"
import { BodyText, HyperLink } from "components/Text"
import { api } from "api"
import * as Sharing from "expo-sharing"
import * as FileSystem from "expo-file-system"
import { HttpClient } from "api/HttpClient"
import { usePalette } from "utils/colors"

const client = HttpClient.getInstance()

const alertMessage = `Questa azione è irreversibile

Tutti i tuoi dati verranno eliminati e non potrai più accedere a PoliNetwork con questo account.

Sei sicuro di voler procedere?`

/**
 * Privacy Page
 */
export const Privacy: SettingsStackScreen<"Privacy"> = () => {
    const [loadingExport, setLoadingExport] = useState(false)
    const { navigate } = useNavigation()
    const { articleSubtitle } = usePalette()

    return (
        <ContentWrapperScroll title="Privacy">
            <View
                style={{
                    paddingTop: 36,
                    paddingBottom: 32,
                    paddingHorizontal: 32,
                }}
            >
                <BodyText>
                    PoliNetwork riconosce la privacy come un valore fondamentale
                    e sostiene il diritto degli utenti di avere il pieno
                    controllo dei propri dati. Nonostante l&apos;app sia
                    progettata per archiviare la minima quantità possibile di
                    dati, e che non ci è possibile risalire all&apos;identità di
                    una persona fisica partendo dai dati in nostro possesso,
                    PoliNetwork fornisce comunque gli strumenti per una buona
                    gestione della privacy, come la cancellazione e
                    l&apos;esportazione dei dati.{"\n"}
                </BodyText>
                <BodyText style={{ fontSize: 14, color: articleSubtitle }}>
                    Per eventuali domande o dubbi sulla privacy, si prega di
                    leggere la Privacy Policy o di contattare{" "}
                    <HyperLink href="mailto:privacy@polinetwork.org">
                        privacy@polinetwork.org
                    </HyperLink>
                    .
                </BodyText>
            </View>
            <Divider />
            <SettingTile
                setting={{
                    loading: loadingExport,
                    title: "Esporta dati",
                    subtitle:
                        "Scarica una copia di tutti i dati che PoliNetwork ha in suo possesso",
                    callback: async () => {
                        setLoadingExport(true)
                        try {
                            const data = await api.user.exportPoliNetworkMe()
                            const uri =
                                FileSystem.cacheDirectory +
                                "polinetwork_data.json"
                            await FileSystem.writeAsStringAsync(
                                uri,
                                JSON.stringify(data, null, 2)
                            )
                            void Sharing.shareAsync(uri)
                        } catch (e) {
                            Alert.alert(
                                "Errore durante l'esportazione dei dati",
                                e + ""
                            )
                            console.error(e)
                        } finally {
                            setLoadingExport(false)
                        }
                    },
                }}
            />
            <SettingTile
                setting={{
                    title: "Imposta autocancellazione",
                    subtitle:
                        "Imposta un timer per l'eliminazione dell'account",
                    callback: () => console.log("Set auto delete"),
                }}
            />
            <Divider />
            <SettingTile
                setting={{
                    title: "Informativa privacy",
                    callback: () => console.log("Privacy policy"),
                }}
            />
            <Divider />
            <SettingTile
                setting={{
                    title: "Cancella account",
                    subtitle:
                        "Cancella i dati relativi a questo account e disconnetti",
                    callback: () => {
                        Alert.alert(
                            "Sicuro di voler cancellare l'account?",
                            alertMessage,
                            [
                                {
                                    text: "Annulla",
                                    style: "cancel",
                                },
                                {
                                    text: "Elimina Account",
                                    style: "destructive",
                                    onPress: async () => {
                                        try {
                                            await api.user.deletePoliNetworkMe()
                                            Alert.alert(
                                                "Account cancellato",
                                                "Il tuo account è stato cancellato con successo"
                                            )
                                            void client.destroyTokens()
                                            navigate("Home")
                                        } catch (e) {
                                            Alert.alert(
                                                "Errore durante la cancellazione dell'account",
                                                e + ""
                                            )
                                            console.error(e)
                                        }
                                    },
                                },
                            ]
                        )
                    },
                }}
            />
        </ContentWrapperScroll>
    )
}
