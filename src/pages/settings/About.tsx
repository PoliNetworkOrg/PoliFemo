import React from "react"
import { View } from "react-native"
import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { BodyText, Text } from "components/Text"
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
    <ContentWrapperScroll title="Info sull'app">
      <View style={{ paddingTop: 32 }}>
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
          Polifemo è l&quot;app pensata per la vita di tutti i giorni degli
          studenti del Politecnico di Milano{"\n"}
          Svilluppata con ❤️ da PoliNetwork{"\n"}
          {"\n"}
          Polifemo è un progetto open source, puoi contribuire al suo sviluppo
          {"\n"}
          su GitHub:{"\n"}
        </BodyText>
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
