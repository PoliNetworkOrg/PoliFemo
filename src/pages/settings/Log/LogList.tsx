import { useNavigation } from "navigation/NavigationTypes"
import { ScrollView, View } from "react-native"
import { Title } from "components/Text"
import { logState, logger_debug, logger_err } from "utils/log/logger"
import { Button } from "components/Button"
import { usePalette } from "utils/colors"
import { NavBar } from "components/NavBar"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { renderItemsForList } from "./renderItemsForList"

export const LogList = ({ setter }: { setter: (x: number) => void }) => {
  const { homeBackground } = usePalette()
  const { navigate } = useNavigation()
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 50,
        backgroundColor: homeBackground,
      }}
    >
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16, // Add padding to the sides
        }}
      >
        <Title style={{ width: "30%" }}>Log</Title>
        <Button
          style={{ width: "30%" }}
          text="Export log"
          onPress={() => {
            logger_debug("Exported log")

            const f = async () => {
              try {
                const d = new Date()
                const s_date =
                  d.getFullYear() + "_" + d.getMonth() + "_" + d.getDay()
                const uri =
                  FileSystem.cacheDirectory + "polifemo_log_" + s_date + ".json"
                await FileSystem.writeAsStringAsync(
                  uri,
                  JSON.stringify(logState, null, 2)
                )
                void Sharing.shareAsync(uri)
              } catch (e) {
                logger_err(e)
              } finally {
              }
            }
            f()
          }}
        />
        <Button
          style={{ width: "30%" }}
          text="Clear log"
          onPress={() => {
            logger_debug("Clear log")
            logState.length = 0
            navigate("Settings")
          }}
        />
      </View>

      <View
        style={{
          marginBottom: 190,
          paddingTop: 20,
        }}
      >
        <ScrollView>{renderItemsForList(setter)}</ScrollView>
        <View
          style={{
            padding: 20,
          }}
        />
      </View>

      <NavBar />
    </View>
  )
}
