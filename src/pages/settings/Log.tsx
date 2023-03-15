import { ScrollView, Text } from "react-native"
import { logs } from "./../../utils/logger"

export const LogsScreen = () => {
  return (
    <ScrollView>
      <Text>{logs.join("\n")}</Text>
    </ScrollView>
  )
}
