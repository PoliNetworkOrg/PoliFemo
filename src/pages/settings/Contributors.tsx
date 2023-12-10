import { BoxShadowView } from "components/BoxShadow"
import { NavBar } from "components/NavBar"
import { BodyText, Text } from "components/Text"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { FlatList, View } from "react-native"
import { palette, usePalette } from "utils/colors"

export const Contributors: SettingsStackScreen<"Contributors"> = () => {
  const { homeBackground, isLight, primary, background } = usePalette()

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
          Contributors
        </Text>
      </View>
      <BoxShadowView
        shadow={{
          color: isLight ? palette.primary : "#000",
          offset: { y: -8 },
          opacity: isLight ? 0.1 : 0.45,
          blur: isLight ? 19 : 32,
        }}
        style={{
          flex: 1,
          marginTop: 86,
        }}
        contentContainerStyle={{
          backgroundColor: background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          overflow: "hidden",
        }}
      >
        <FlatList
          data={[]}
          contentContainerStyle={{ paddingBottom: 120, padding: 12 }}
          renderItem={({ item, index }) => (
            <View
              style={{ marginVertical: 6 }}
              key={`__contributors-item-${index}`}
            >
              <BodyText>ciao</BodyText>
            </View>
          )}
        />
      </BoxShadowView>
      <NavBar />
    </View>
  )
}
