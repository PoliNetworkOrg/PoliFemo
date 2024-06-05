import { useContext, useEffect, useState } from "react"
import { Alert, Linking } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { Divider } from "components/Divider"
import { SettingTile } from "components/Settings/SettingTile"
import { BodyText, HyperLink } from "components/Text"
import { api } from "api"
import * as Sharing from "expo-sharing"
import * as FileSystem from "expo-file-system"
import { HttpClient } from "api/HttpClient"
import { LoginContext } from "contexts/login"
import { Description } from "components/Settings/Description"
import { useTranslation } from "react-i18next"
import { ScrollPage } from "components/PageLayout"
import { ModalPicker } from "components/ModalPicker"

const client = HttpClient.getInstance()

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

  const autodeleteTimes: { value: number | string; label: string }[] = [
    //non so per quale dannato motivo non mi funzionino i plurali, devo per forza mettere one e other!
    { value: 30, label: t("day.dayCount_other", { ns: "common", count: 30 }) },
    { value: 60, label: t("day.dayCount_other", { ns: "common", count: 60 }) },
    { value: 90, label: t("day.dayCount_other", { ns: "common", count: 90 }) },
    {
      value: 180,
      label: t("month.monthCount_other", { ns: "common", count: 6 }),
    },
    { value: 365, label: t("year.yearCount_one", { ns: "common", count: 1 }) },
    {
      value: 730,
      label: t("year.yearCount_other", { ns: "common", count: 2 }),
    },
    {
      value: 1095,
      label: t("year.yearCount_other", { ns: "common", count: 3 }),
    },
    {
      value: 1460,
      label: t("year.yearCount_other", { ns: "common", count: 4 }),
    },
    {
      value: 1825,
      label: t("year.yearCount_other", { ns: "common", count: 5 }),
    },
  ]

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
    <ScrollPage upperTitle="Privacy">
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
            loading={loadingExport}
            title={t("settings_export")}
            subtitle={"" + t("settings_exportSubtitle")}
            callback={async () => {
              setLoadingExport(true)
              try {
                const data = await api.user.exportPoliNetworkMe()
                const uri = FileSystem.cacheDirectory + "polinetwork_data.json"
                await FileSystem.writeAsStringAsync(
                  uri,
                  JSON.stringify(data, null, 2),
                )
                void Sharing.shareAsync(uri)
              } catch (e) {
                Alert.alert(t("settings_export_error"), e + "")
                console.error(e)
              } finally {
                setLoadingExport(false)
              }
            }}
          />
          <SettingTile
            title={t("settings_autoDelete")}
            subtitle={"" + t("settings_autoDeleteSubTitle")}
            callback={() => setShowingAutodeleteModal(true)}
          />
          <SettingTile
            title={t("settings_delete")}
            subtitle={"" + t("settings_deleteSubTitle")}
            callback={() => {
              Alert.alert(
                t("settings_delete_question"),
                "" + t("settings_delete_alert_message"),
                [
                  {
                    text: "" + t("cancel", { ns: "common" }),
                    style: "cancel",
                  },
                  {
                    text: "" + t("settings_delete"),
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await api.user.deletePoliNetworkMe()
                        Alert.alert(
                          t("settings_deleted"),
                          "" + t("settings_deleted_message"),
                        )
                        void client.destroyTokens()
                        navigate("Home")
                      } catch (e) {
                        Alert.alert(t("settings_deleted_error"), e + "")
                        console.error(e)
                      }
                    },
                  },
                ],
              )
            }}
          />
          <Description>{t("settings_delete_message")}</Description>
        </>
      )}
      <Divider />
      <SettingTile
        title={t("settings_privacyDisclaimer")}
        subtitle={"" + t("settings_privacyDisclaimerSubTitle")}
        callback={() =>
          Linking.openURL("https://polinetwork.org/learnmore/privacy/")
        }
      />
      <Description>
        {t("settings_privacyDisclaimer_message")}{" "}
        <HyperLink href="mailto:privacy@polinetwork.org">
          privacy@polinetwork.org
        </HyperLink>
        .
      </Description>
      <ModalPicker
        title={t("settings_autoDelete_modalTitle")}
        subTitle={"" + t("settings_autoDelete_modalSubTitle")}
        centerText
        isShowing={showingAutodeleteModal}
        onClose={() => setShowingAutodeleteModal(false)}
        elements={autodeleteTimes}
        selectedValue={autodeleteTime}
        onSelect={async value => {
          try {
            await api.user.updatePoliNetworkSettings({
              settings: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                expire_in_days: value as number,
              },
            })
            setAutodeleteTime(value as number)
            setShowingAutodeleteModal(false)
            Alert.alert(
              "Impostazioni aggiornate",
              `Nuovo periodo di inattività per la cancellazione automatica dei dati impostato a ${value} giorni`,
            )
          } catch (e) {
            Alert.alert("Errore durante l'aggiornamento", e + "")
            console.error(e)
          }
        }}
      />
    </ScrollPage>
  )
}
