import { ScrollView } from "react-native"
import { logs, logToString } from "./../../utils/logger"

import { View } from "react-native"
import { Text } from "components/Text"
import { exportAndShareFile } from "utils/file"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"

export const LogsScreen = () => {
  return (
    <ContentWrapperScroll
      buttonsNavbar={[
        {
          title: "Export logs",
          onPress: async () => {
            const content = JSON.stringify(logs, null, 2)
            const date = new Date()
            const stringDate = date.toDateString()
            await exportAndShareFile(
              content,
              "log_" + stringDate + ".json",
              "Export Logs"
            )
          },
        },
      ]}
    >
      <View style={{ paddingTop: 20, paddingBottom: 80 }}>
        <ScrollView>
          <Text>
            {logs
              .map(f => {
                return logToString(f)
              })
              .join("\n\n")
              .trim()}
          </Text>
        </ScrollView>
      </View>
    </ContentWrapperScroll>
  )
}
