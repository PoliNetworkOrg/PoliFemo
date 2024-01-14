import { SettingsStackScreen, useNavigation } from "navigation/NavigationTypes"
import { Pressable, ScrollView, View } from "react-native"
import { Text, Title } from "components/Text"
import { logState, logger_debug, logger_err } from "utils/log/logger"
import { Button } from "components/Button"
import { usePalette } from "utils/colors"
import { NavBar } from "components/NavBar"
import { useState } from "react"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { Alert, Linking } from "react-native"

const logItemView: number = -1

function renderValues(setter: (x: number) => void) {
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

const LogList = ({ setter }: { setter: (x: number) => void }) => {
  const { homeBackground } = usePalette()
  const { navigate } = useNavigation()
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
        <Title style={{ width: "30%" }}>Log</Title>
        <Button
          style={{ width: "30%" }}
          text="Export log"
          onPress={() => {
            logger_debug("Exported log")

            const f = async () => {
              try {
                const d = new Date()
                const s_date =
                  d.getFullYear() + "_" + d.getMonth() + "_" + d.getDay()
                const uri =
                  FileSystem.cacheDirectory + "polifemo_log_" + s_date + ".json"
                await FileSystem.writeAsStringAsync(
                  uri,
                  JSON.stringify(logState, null, 2)
                )
                void Sharing.shareAsync(uri)
              } catch (e) {
                logger_err(e)
              } finally {
              }
            }
            f()
          }}
        ></Button>
        <Button
          style={{ width: "30%" }}
          text="Clear log"
          onPress={() => {
            logger_debug("Clear log")
            logState.length = 0
            navigate("Settings")
          }}
        ></Button>
      </View>

      <View
        style={{
          marginBottom: 190,
          paddingTop: 20,
        }}
      >
        <ScrollView>{renderValues(setter)}</ScrollView>
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

const ItemLog = ({
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

export const Log: SettingsStackScreen<"Log"> = () => {
  const [stateNav, setStateNav] = useState(logItemView)
  const setter = (x: number) => {
    setStateNav(x)
  }
  const { homeBackground } = usePalette()
  const { navigate } = useNavigation()

  return (
    <View style={{ flex: 1, paddingTop: 0, backgroundColor: homeBackground }}>
      {stateNav < 0 ? (
        logState.length > 0 ? (
          <LogList setter={setter} />
        ) : (
          <View
            style={{
              paddingTop: 100,
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                padding: 30,
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Text>No logs.</Text>
              <View
                style={{
                  padding: 30,
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Button
                  text="Go back"
                  onPress={() => {
                    navigate("Settings")
                  }}
                ></Button>
              </View>
            </View>
          </View>
        )
      ) : (
        <ItemLog setter={setter} stateNav={stateNav}></ItemLog>
      )}
    </View>
  )
}
