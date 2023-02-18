import React from "react"
import { Linking, View } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { BodyText, HyperLink, Text, Title } from "components/Text"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { SettingTile } from "components/Settings/SettingTile"
import { MainTitle } from "components/Home"
import Constants from "expo-constants"
import * as Application from "expo-application"
import * as Device from "expo-device"
import { usePalette } from "utils/colors"

/**
 * Notifications Settings Page
 */
export const About: SettingsStackScreen<"About"> = () => {
  const { navigate } = useNavigation()
  const { articleSubtitle, articleTitle } = usePalette()
  return (
    <ContentWrapperScroll title="Su quest'app">
      <View style={{ paddingTop: 32, paddingBottom: 80 }}>
        <MainTitle />
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
        </BodyText>
        <BodyText style={{ paddingHorizontal: 32 }}>
          <Title style={{ fontSize: 24 }}>
            Informazioni sull&quot;app{"\n"}
          </Title>
          Polifemo è l&quot;app pensata per la vita di tutti i giorni degli
          studenti del Politecnico di Milano{"\n"}
          Svilluppata con ❤️ da PoliNetwork{"\n"}
          {"\n"}
          <Title style={{ fontSize: 24 }}>Source code{"\n"}</Title>
          Polifemo è un progetto open source, puoi contribuire al suo sviluppo
          su GitHub!{"\n"}
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
        <SettingTile
          setting={{
            title: "Riporta un problema",
            subtitle: "Segnala un bug o suggerisci una nuova funzionalità",
            callback: () =>
              Linking.openURL(
                "https://github.com/PoliNetworkOrg/PoliFemo/issues/new"
              ),
          }}
        />
        <SettingTile
          setting={{
            title: "Contattaci",
            subtitle: "Link di contatto per qualsiasi domanda",
            callback: () =>
              Linking.openURL("https://polinetwork.org/learnmore/contacts/"),
          }}
        />
        <SettingTile
          setting={{
            title: "Licenze",
            subtitle: "Visualizza le licenze dei pacchetti utilizzati",
            callback: () => {
              navigate("Licenses")
            },
          }}
        />
      </View>
    </ContentWrapperScroll>
  )
}
