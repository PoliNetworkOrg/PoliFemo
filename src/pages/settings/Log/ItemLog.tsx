import { ScrollView, View } from "react-native"
import { Text } from "components/Text"
import { logState } from "utils/log/logger"
import { Button } from "components/Button"

export const ItemLog = ({
  setter,
  stateNav,
}: {
  setter: (x: number) => void
  stateNav: number
}) => {
  return (
    <View style={{ paddingBottom: 150, paddingTop: 50 }}>
      <View style={{ padding: 10 }}>
        <Button
          text="Go back"
          onPress={() => {
            setter(-1)
          }}
        />
      </View>

      <View style={{ padding: 10 }}>
        <Text>{logState[stateNav].date.toString()}</Text>
        <Text>{logState[stateNav].level.toString()}</Text>
        {logState[stateNav].msg && (
          <Text>{logState[stateNav].msg?.toString()}</Text>
        )}
        {logState[stateNav].object && (
          <Text>{JSON.stringify(logState[stateNav].object)}</Text>
        )}
      </View>

      <ScrollView>
        {logState[stateNav].stack.map((x, y) => {
          return (
            <View style={{ padding: 5 }}>
              <Text>{x}</Text>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
