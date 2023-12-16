import { useContext } from "react"
import { Alert, Linking, View } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { BodyText, HyperLink, Text, Title } from "components/Text"
import { SettingTile } from "components/Settings/SettingTile"
import { MainTitle } from "components/Home"
import Constants from "expo-constants"
import * as Application from "expo-application"
import * as Device from "expo-device"
import * as Clipboard from "expo-clipboard"
import { usePalette } from "utils/colors"
import { LoginContext } from "contexts/login"
import { Canvas, Group, ImageSVG, useSVG } from "@shopify/react-native-skia"
import polifemoIcon from "assets/polifemo/happy.svg"
import { Divider } from "components/Divider"
import { useTranslation } from "react-i18next"

import { getGMSStatus } from "utils/hasGMS"
import { ScrollPage } from "components/PageLayout"

/**
 * Notifications Settings Page
 */
export const About: SettingsStackScreen<"About"> = () => {
  const { navigate } = useNavigation()
  const { articleSubtitle, articleTitle } = usePalette()
  const { loggedIn, userInfo } = useContext(LoginContext)
  const polifemoSVG = useSVG(polifemoIcon)

  const { t } = useTranslation("settings")

  return (
    <ScrollPage
      upperTitle={"" + t("settings_infoAppTitle")}
      contentContainerStyle={{
        paddingTop: 32,
      }}
    >
      <MainTitle />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 40,
        }}
      >
        <Canvas
          style={{
            height: 128,
            width: 65,
          }}
        >
          {polifemoSVG && (
            <Group transform={[{ scale: 1.82 }]}>
              <ImageSVG
                svg={polifemoSVG}
                x={-9.2}
                y={-29.5}
                width={63}
                height={128}
              />
            </Group>
          )}
        </Canvas>
        <View>
          <Text
            style={{
              color: articleTitle,
              textAlign: "center",
              fontSize: 24,
            }}
          >
            by{"\n"}PoliNetwork
          </Text>
          <BodyText
            style={{
              textAlign: "center",
              fontSize: 14,
              color: articleSubtitle,
              marginVertical: 24,
            }}
          >
            Versione {Constants.manifest2?.extra?.expoClient?.version}
            {__DEV__ ? " (dev mode)" : ""}
            {"\n"}
            Build {Application.nativeBuildVersion}
            {"\n"}
            OS: {Device.osName} {Device.osVersion}
            {" - "}
            {Device.modelName} {Device.isDevice ? "" : "(emulator)"}
            {"\n"}
            env: {Constants.appOwnership} - {Constants.executionEnvironment}
            {"\n"}
            GMS: {getGMSStatus()}
          </BodyText>
        </View>
      </View>
      <BodyText style={{ paddingHorizontal: 32, paddingBottom: 16 }}>
        <Title style={{ fontSize: 24 }}>{t("settings_info") + "\n"}</Title>
        {t("settings_info_message")}
        <Title style={{ fontSize: 24 }}>Source code{"\n"}</Title>
        {t("settings_sourceCode_message")}
        Client:{" "}
        <HyperLink href="https://github.com/polinetworkorg/polifemo">
          PoliNetworkOrg/PoliFemo
        </HyperLink>
        {"\n"}
        Server:{" "}
        <HyperLink href="https://github.com/polinetworkorg/polifemobackend">
          PoliNetworkOrg/PoliFemoBackend
        </HyperLink>
      </BodyText>
      <Divider />
      <SettingTile
        title={"Contributors"}
        subtitle={"" + t("settings_contributorsSubTitle")}
        callback={() => navigate("Contributors")}
      />
      <SettingTile
        title={t("settings_report")}
        subtitle={"" + t("settings_reportSubTitle")}
        callback={() =>
          Linking.openURL(
            "https://github.com/PoliNetworkOrg/PoliFemo/issues/new/choose"
          )
        }
      />
      <SettingTile
        title={t("settings_contacts")}
        subtitle={"" + t("settings_contactsSubTitile")}
        callback={() =>
          Linking.openURL("https://polinetwork.org/learnmore/contacts/")
        }
      />
      {loggedIn ? (
        <SettingTile
          title={t("settings_userId")}
          subtitle={"" + t("settings_userIdSubTitle")}
          callback={async () => {
            await Clipboard.setStringAsync(userInfo.userID)
            Alert.alert(t("settings_copied"), "" + t("settings_alert_message"))
          }}
        />
      ) : null}
      <SettingTile
        title={t("settings_licenses")}
        subtitle={"" + t("settings_licensesSubTitle")}
        callback={() => navigate("Licenses")}
      />
    </ScrollPage>
  )
}
