import { Pressable, View } from "react-native"
import { Text } from "components/Text"
import { logState } from "utils/log/logState"
import { usePalette } from "utils/colors"

export function renderItemsForList(setter: (x: number) => void) {
  const { backgroundSecondary, background } = usePalette()
  return logState.map((value, index) => (
    <View
      key={index}
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
      }}
    >
      <Pressable
        onPress={() => {
          setter(index)
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: background,
            padding: 10,
            borderRadius: 5,
            backgroundColor: backgroundSecondary,
          }}
        >
          <Text>{value.date.toString()}</Text>
          <Text>{value.level.toString()}</Text>
          {value.msg && <Text>{value.msg?.toString()}</Text>}
          {value.object && <Text>{JSON.stringify(value.object)}</Text>}
        </View>
      </Pressable>
    </View>
  ))
}
