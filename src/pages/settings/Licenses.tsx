import React from "react"
import licenses from "assets/settings/licenses.json"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { NavBar } from "components/NavBar"
import { Linking, Pressable, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { BodyText, Text } from "components/Text"
import { usePalette } from "utils/colors"
import { Divider } from "components/Divider"

export const Licenses: SettingsStackScreen<"Licenses"> = () => {
  const { background, homeBackground, primary, isLight } = usePalette()
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: homeBackground,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 42,
          left: 26,
          zIndex: 6,
        }}
      >
        <Text
          style={{
            color: isLight ? "#fff" : primary,
            fontSize: 24,
            fontWeight: "900",
          }}
        >
          Licenze
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: background,
          marginTop: 86,

          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.2,
          shadowRadius: 8.3,
          elevation: 13,
        }}
      >
        <View
          style={{
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: "hidden",
          }}
        >
          <FlatList
            data={licenses}
            contentContainerStyle={{ paddingBottom: 120, padding: 12 }}
            ListHeaderComponent={() => (
              <Text style={{ marginBottom: 12 }}>
                The following sets forth attribution notices for third party
                software that may be contained in portions of this the Polifemo
                by PoliNetwork app
              </Text>
            )}
            renderItem={({ item, index }) => (
              <View
                style={{ marginVertical: 6 }}
                key={`__license-item-${index}`}
              >
                <Pressable
                  onPress={() => {
                    if (item.licenseURL) void Linking.openURL(item.licenseURL)
                  }}
                  style={{ flexDirection: "row", marginBottom: 4 }}
                >
                  <BodyText style={{ flex: 1 }}>{item.package}</BodyText>
                  <BodyText style={{ fontWeight: "bold" }}>
                    {item.license}
                  </BodyText>
                </Pressable>
                {item.licenseText ? (
                  <View>
                    <BodyText style={{ fontSize: 12 }}>
                      {item.licenseText}
                    </BodyText>
                  </View>
                ) : null}
                <Divider />
              </View>
            )}
          />
        </View>
      </View>
      <NavBar />
    </View>
  )
}
