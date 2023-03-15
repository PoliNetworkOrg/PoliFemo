import { ScrollView } from "react-native"
import { logs } from "./../../utils/logger"

import { View } from "react-native"
import { Text } from "components/Text"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { MainTitle } from "components/Home"

export const LogsScreen = () => {
  return (
    <ContentWrapperScroll title="Logs">
      <View style={{ paddingTop: 32, paddingBottom: 80 }}>
        <MainTitle />
        <ScrollView>
          <Text>{logs.join("\n")}</Text>
        </ScrollView>
      </View>
    </ContentWrapperScroll>
  )
}
