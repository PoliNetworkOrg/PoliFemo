import React from "react"
import licenses from "assets/settings/licenses.json"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { NavBar } from "components/NavBar"
import { Linking, Pressable, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { BodyText, Text } from "components/Text"
import { usePalette } from "utils/colors"
import { Divider } from "components/Divider"
import WebView from "react-native-webview"

export const PoliMiApp: SettingsStackScreen<"PoliMiApp"> = () => {
  const { background, homeBackground, primary, isLight, articleTitle } =
    usePalette()
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: homeBackground,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: background,
          marginTop: 30,
          marginBottom: 100,

          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.2,
          shadowRadius: 8.3,
          elevation: 13,
        }}
      >
        <WebView
          source={{
            uri: "https://polimiapp.polimi.it/polimi_app/app/",
          }}
          style={{ marginTop: 5 }}
        />
      </View>
      <NavBar />
    </View>
  )
}
