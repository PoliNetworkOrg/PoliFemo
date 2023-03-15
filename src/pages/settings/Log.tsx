import { ScrollView } from "react-native"
import { logs, logToString } from "./../../utils/logger"

import { View } from "react-native"
import { Text } from "components/Text"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Button } from "components/Button"
import { exportAndShareFile } from "utils/file"

export const LogsScreen = () => {
  return (
    <ContentWrapperScroll title="Logs">
      <View style={{ paddingTop: 32, paddingBottom: 80 }}>
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
        <Button
          onPress={async () => {
            const content = JSON.stringify(logs, null, 2)
            const date = new Date()
            const stringDate = date.toDateString()
            await exportAndShareFile(content, "log_" + stringDate + ".json")
          }}
        />
      </View>
    </ContentWrapperScroll>
  )
}
