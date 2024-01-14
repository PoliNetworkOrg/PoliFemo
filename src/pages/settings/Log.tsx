import { SettingsStackScreen } from "navigation/NavigationTypes"
import { NavBar } from "components/NavBar"
import { Linking, Pressable, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { BodyText, Text } from "components/Text"
import { usePalette } from "utils/colors"
import { Divider } from "components/Divider"
import { BoxShadowView } from "components/BoxShadow"

export const Log: SettingsStackScreen<"Log"> = () => {
  const {
    background,
    homeBackground,
    primary,
    isLight,
    articleTitle,
    palette,
  } = usePalette()
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
        <Text>Ciao</Text>
      </View>
    </View>
  )
}
