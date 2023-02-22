import React, { useContext } from "react"
import { Alert, Linking, View } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { BodyText, HyperLink, Text, Title } from "components/Text"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { SettingTile } from "components/Settings/SettingTile"
import { MainTitle } from "components/Home"
import Constants from "expo-constants"
import * as Application from "expo-application"
import * as Device from "expo-device"
import * as Clipboard from "expo-clipboard"
import { usePalette } from "utils/colors"
import { LoginContext } from "contexts/login"
import { Canvas, Group, ImageSVG, useSVG } from "@shopify/react-native-skia"
import polifemoIcon from "assets/highlights/polifemo.svg"
import { Divider } from "components/Divider"

/**
 * Notifications Settings Page
 */
export const About: SettingsStackScreen<"About"> = () => {
  const { navigate } = useNavigation()
  const { articleSubtitle, articleTitle } = usePalette()
  const { loggedIn, userInfo } = useContext(LoginContext)
  const polifemoSVG = useSVG(polifemoIcon)
  const isRunningInExpoGo = Constants.appOwnership === "expo"

  return (
    <ContentWrapperScroll title="Su quest'app">
      <View style={{ paddingTop: 32, paddingBottom: 80 }}>
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
            </BodyText>
          </View>
        </View>
        <BodyText style={{ paddingHorizontal: 32, paddingBottom: 16 }}>
          <Title style={{ fontSize: 24 }}>
            Informazioni sull&quot;app{"\n"}
          </Title>
          Un&apos;app pensata per semplificare la vita di tutti gli studenti del
          Politecnico permettendo a loro di potersi concentrare al massimo sullo
          studio e lasciare il resto a PoliFemo{"\n"}
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
        <Divider />
        <SettingTile
          setting={{
            title: "Riporta un problema",
            subtitle: "Segnala un bug o suggerisci una nuova funzionalità",
            callback: () =>
              Linking.openURL(
                "https://github.com/PoliNetworkOrg/PoliFemo/issues/new/choose"
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
        {loggedIn ? (
          <SettingTile
            setting={{
              title: "Copia ID utente",
              subtitle: "Copia il tuo ID utente PoliNetwork negli appunti",
              callback: async () => {
                await Clipboard.setStringAsync(userInfo.userID)
                Alert.alert(
                  "Copiato!",
                  "Il tuo ID utente è stato copiato negli appunti."
                )
              },
            }}
          />
        ) : null}
        <SettingTile
          setting={{
            title: "Licenze",
            subtitle: "Visualizza le licenze dei pacchetti utilizzati",
            callback: () => {
              navigate("Licenses")
            },
          }}
        />
        {isRunningInExpoGo ? (
          <SettingTile
            setting={{
              title: "PoliMi WebApp",
              subtitle: "App Polimi",
              callback: () => {
                navigate("PoliMiApp")
              },
            }}
          />
        ) : null}
      </View>
    </ContentWrapperScroll>
  )
}
