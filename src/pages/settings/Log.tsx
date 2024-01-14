import { SettingsStackScreen } from "navigation/NavigationTypes"
import { ScrollView, View } from "react-native"
import { Text } from "components/Text"
import { ScrollPage } from "components/PageLayout"
import { LogItem, logValues } from "utils/log/logger"
import { Button } from "components/Button"

function renderValues(logValues: LogItem[]) {
  return logValues.map((value, index) => (
    <View
      key={index}
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
      }}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: "black",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text>{value.date.toString()}</Text>
        <Text>{value.level.toString()}</Text>
        {value.msg && <Text>{value.msg?.toString()}</Text>}
        {value.object && <Text>{JSON.stringify(value.object)}</Text>}
        <Button text="Stack" onPress={() => {}}></Button>
      </View>
    </View>
  ))
}

export const Log: SettingsStackScreen<"Log"> = () => {
  return (
    <>
      <ScrollView>{renderValues(logValues)}</ScrollView>

      <Button text="Ciao"></Button>
    </>
  )
}
