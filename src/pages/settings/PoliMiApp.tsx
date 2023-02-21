import React, { useContext, useEffect, useState } from "react"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { NavBar } from "components/NavBar"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import WebView from "react-native-webview"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LoginContext, Tokens } from "contexts/login"

export const PoliMiApp: SettingsStackScreen<"PoliMiApp"> = () => {
  const { background, homeBackground } = usePalette()

  const [polimiToken, setPolimiToken] = useState<string>("")

  const { loggedIn } = useContext(LoginContext)

  const getToken = async () => {
    const tokens = await AsyncStorage.getItem("api:tokens")
    if (tokens) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsedTokens: Tokens = JSON.parse(tokens)
      setPolimiToken(parsedTokens.polimiToken.accessToken)
    } else {
      setPolimiToken("")
    }
  }

  useEffect(() => void getToken())

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
            headers: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              Authorization: "Bearer" + " " + polimiToken,
            },
          }}
          incognito={loggedIn ? false : true}
          style={{ marginTop: 5 }}
        />
      </View>
      <NavBar />
    </View>
  )
}
