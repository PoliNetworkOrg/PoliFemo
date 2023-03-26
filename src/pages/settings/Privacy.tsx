import { useContext, useEffect, useState } from "react"
import { Alert, Linking } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings/SettingTile"
import { BodyText, HyperLink } from "components/Text"
import { api } from "api"
import * as Sharing from "expo-sharing"
import * as FileSystem from "expo-file-system"
import { HttpClient } from "api/HttpClient"
import { LoginContext } from "contexts/login"
import { ModalPicker } from "components/Settings/ModalPicker"
import { Description } from "components/Settings/Description"
import { useTranslation } from "react-i18next"

const client = HttpClient.getInstance()

const autodeleteTimes: { value: number; label: string }[] = [
  { value: 30, label: "30 giorni" },
  { value: 60, label: "60 giorni" },
  { value: 90, label: "90 giorni" },
  { value: 180, label: "6 mesi" },
  { value: 365, label: "1 anno" },
  { value: 730, label: "2 anni" },
  { value: 1095, label: "3 anni" },
  { value: 1460, label: "4 anni" },
  { value: 1825, label: "5 anni" },
]

const exportDesc =
  "Scarica una copia in formato JSON di tutti i dati che PoliNetwork ha in suo possesso in modo semplice e sicuro."

const autodeleteDesc =
  "Dopo un periodo di inattività, i tuoi dati verranno cancellati automaticamente. Il periodo predefinito è 2 anni senza accesso, puoi modificarlo da un minimo di 30 giorni a un massimo di 5 anni."

const deleteAlertMessage = `Questa azione è irreversibile

Tutti i tuoi dati verranno eliminati e non potrai più accedere a PoliNetwork con questo account.

Sei sicuro di voler procedere?`

/**
 * Privacy Page
 */
export const Privacy: SettingsStackScreen<"Privacy"> = () => {
  const { loggedIn } = useContext(LoginContext)
  const { navigate } = useNavigation()

  const [loadingExport, setLoadingExport] = useState(false)

  const [showingAutodeleteModal, setShowingAutodeleteModal] = useState(false)
  const [autodeleteTime, setAutodeleteTime] = useState(730)

  const { t } = useTranslation("settings")

  useEffect(() => {
    if (loggedIn) {
      api.user
        .getPoliNetworkSettings()
        .then(settings => {
          setAutodeleteTime(settings.expire_in_days)
        })
        .catch(() => {
          console.log("Error while getting settings in privacy page")
        })
    }
  }, [loggedIn])

  return (
    <ContentWrapperScroll title="Privacy">
      <BodyText
        style={{
          paddingTop: 36,
          paddingHorizontal: 32,
        }}
      >
        {t("settings_privacy_message")}
      </BodyText>
      <Description>
        {t("settings_privacy_questions")}{" "}
        <HyperLink href="mailto:privacy@polinetwork.org">
          privacy@polinetwork.org
        </HyperLink>
        .
      </Description>
      {loggedIn && (
        <>
          <Divider />
          <SettingTile
            setting={{
              loading: loadingExport,
              title: "Esporta dati",
              subtitle: exportDesc,
              callback: async () => {
                setLoadingExport(true)
                try {
                  const data = await api.user.exportPoliNetworkMe()
                  const uri =
                    FileSystem.cacheDirectory + "polinetwork_data.json"
                  await FileSystem.writeAsStringAsync(
                    uri,
                    JSON.stringify(data, null, 2)
                  )
                  void Sharing.shareAsync(uri)
                } catch (e) {
                  Alert.alert("Errore durante l'esportazione dei dati", e + "")
                  console.error(e)
                } finally {
                  setLoadingExport(false)
                }
              },
            }}
          />
          <SettingTile
            setting={{
              title: "Autocancellazione dei dati per inattività",
              subtitle: autodeleteDesc,
              callback: () => setShowingAutodeleteModal(true),
            }}
          />
          <SettingTile
            setting={{
              title: "Cancella account",
              subtitle:
                "Cancella permanentemente i dati relativi a questo account ed effettua il logout",
              callback: () => {
                Alert.alert(
                  "Sicuro di voler cancellare l'account?",
                  deleteAlertMessage,
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
          <Description>
            La possibilità di cancellare i tuoi dati in modo semplice è un
            aspetto cruciale per garantire la tua privacy e la tua sicurezza
            nella nostra app. Questa opzione ti permette di rimuovere in modo
            permanente tutte le informazioni che hai fornito a PoliNetwork.
            {"\n"}È sempre possibile verificare i dati collegati al tuo account
            salvati da noi tramite la sezione &quot;Esporta&quot; delle
            impostazioni privacy.{"\n"}Una volta che i dati sono stati
            cancellati, non saranno più disponibili o recuperabili. Questa
            opzione fornisce agli utenti il pieno controllo sui propri dati. La
            cancellazione dei dati può essere eseguita in qualsiasi momento.
          </Description>
        </>
      )}
      <Divider />
      <SettingTile
        setting={{
          title: t("settings_privacyDisclaimer"),
          subtitle: "" + t("settings_privacyDisclaimerSubTitle"),
          callback: () =>
            Linking.openURL("https://polinetwork.org/learnmore/privacy/"),
        }}
      />
      <Description last>
        {t("settings_privacyDisclaimer_message")}{" "}
        <HyperLink href="mailto:privacy@polinetwork.org">
          privacy@polinetwork.org
        </HyperLink>
        .
      </Description>
      <ModalPicker
        title="Cancellazione dei dati per inattività"
        subTitle="Scegli un periodo di inattività dopo il quale i tuoi dati verranno eliminati per la tua privacy."
        isShowing={showingAutodeleteModal}
        onClose={() => setShowingAutodeleteModal(false)}
        elements={autodeleteTimes}
        selectedValue={autodeleteTime}
        onSelect={async value => {
          try {
            await api.user.updatePoliNetworkSettings({
              // eslint-disable-next-line @typescript-eslint/naming-convention
              expire_in_days: value,
            })
            setAutodeleteTime(value)
            setShowingAutodeleteModal(false)
            Alert.alert(
              "Impostazioni aggiornate",
              `Nuovo periodo di inattività per la cancellazione automatica dei dati impostato a ${value} giorni`
            )
          } catch (e) {
            Alert.alert("Errore durante l'aggiornamento", e + "")
            console.error(e)
          }
        }}
      />
    </ContentWrapperScroll>
  )
}
