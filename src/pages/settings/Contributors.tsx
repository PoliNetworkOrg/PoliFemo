import { NavBar } from "components/NavBar"
import { BodyText } from "components/Text"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { View } from "react-native"
import { usePalette } from "utils/colors"

export const Contributors: SettingsStackScreen<"Contributors"> = () => {
  const { homeBackground } = usePalette()
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
        <BodyText>ciao</BodyText>
      </View>
      <NavBar />
    </View>
  )
}
