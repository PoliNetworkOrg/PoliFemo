import { ScrollView } from "react-native"
import { logs, SingleLog } from "./../../utils/logger"

import { View } from "react-native"
import { Text } from "components/Text"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { MainTitle } from "components/Home"

function logToString(singleLog: SingleLog) {
  const string = singleLog.date + " " + singleLog.content
  return string
}

export const LogsScreen = () => {
  const logsToPrint = logs
    .map(f => {
      return logToString(f)
    })
    .join("\n\n")
    .trim()
  return (
    <ContentWrapperScroll title="Logs">
      <View style={{ paddingTop: 32, paddingBottom: 80 }}>
        <MainTitle />
        <ScrollView>
          <Text>{logsToPrint}</Text>
        </ScrollView>
      </View>
    </ContentWrapperScroll>
  )
}
