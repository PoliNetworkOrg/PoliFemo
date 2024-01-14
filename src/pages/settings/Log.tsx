import { SettingsStackScreen } from "navigation/NavigationTypes"
import { Pressable, ScrollView, View } from "react-native"
import { Text, Title } from "components/Text"
import { logState, logger_debug } from "utils/log/logger"
import { Button } from "components/Button"
import { usePalette } from "utils/colors"
import { NavBar } from "components/NavBar"

function renderValues() {
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
          console.log({ index })
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

export const Log: SettingsStackScreen<"Log"> = () => {
  const { homeBackground } = usePalette()
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
          flexDirection: "row", // Arrange children horizontally
          justifyContent: "space-between", // Space between children
          alignItems: "center", // Center vertically
          paddingHorizontal: 16, // Add padding to the sides
        }}
      >
        <Title style={{ width: "50%" }}>Log</Title>
        <Button
          style={{ width: "50%" }}
          text="Export log"
          onPress={() => {
            logger_debug("Exported log")
          }}
        ></Button>
      </View>

      <View
        style={{
          marginBottom: 190,
          paddingTop: 20,
        }}
      >
        <ScrollView>{renderValues()}</ScrollView>
        <View
          style={{
            padding: 20,
          }}
        ></View>
      </View>

      <NavBar />
    </View>
  )
}
