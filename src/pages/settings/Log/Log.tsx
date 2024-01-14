import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View } from "react-native"
import { Text } from "components/Text"
import { logState } from "utils/log/logState"
import { Button } from "components/Button"
import { usePalette } from "utils/colors"
import { useState } from "react"
import { LogList } from "./LogList"
import { ItemLog } from "./ItemLog"

export const Log: SettingsStackScreen<"Log"> = () => {
  const [stateNav, setStateNav] = useState(-1)
  const setter = (x: number) => {
    setStateNav(x)
  }
  const { homeBackground } = usePalette()
  const { navigate } = useNavigation()

  return (
    <View style={{ flex: 1, paddingTop: 0, backgroundColor: homeBackground }}>
      {stateNav < 0 ? (
        logState.length > 0 ? (
          <LogList setter={setter} />
        ) : (
          <View
            style={{
              paddingTop: 100,
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                padding: 30,
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Text>No logs.</Text>
              <View
                style={{
                  padding: 30,
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Button
                  text="Go back"
                  onPress={() => {
                    navigate("Settings")
                  }}
                />
              </View>
            </View>
          </View>
        )
      ) : (
        <ItemLog setter={setter} stateNav={stateNav} />
      )}
    </View>
  )
}
