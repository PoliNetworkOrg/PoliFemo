import { ScrollView } from "react-native"
import { logs, logToString } from "./../../utils/logger"

import { View } from "react-native"
import { Text } from "components/Text"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"

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
      </View>
    </ContentWrapperScroll>
  )
}
