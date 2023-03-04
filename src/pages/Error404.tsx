import { MainStackScreen } from "navigation/NavigationTypes"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { Text } from "components/Text"
import deletesvg from "assets/modal/delete.svg"
import { useNavigation } from "navigation/NavigationTypes"
import { NavBar } from "components/NavBar"
import { Icon } from "components/Icon"

export const Error404: MainStackScreen<"Error404"> = () => {
  const { background, homeBackground, isLight } = usePalette()
  const navigation = useNavigation()
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: !isLight ? background : homeBackground,
      }}
    >
      <View
        style={{
          width: 300,
          height: 400,
          backgroundColor: "white",
          borderRadius: 12,
          paddingVertical: 12,
        }}
      >
        <Pressable
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            top: 12,
            right: 8,
            zIndex: 1,
          }}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon source={deletesvg} />
          </View>
        </Pressable>
        <Text
          style={{
            textAlign: "center",
            color: isLight ? homeBackground : background,
            fontSize: 28,
          }}
        >
          Error 404
        </Text>
        <View style={{ flex: 1 }} />
        <Text
          style={{
            textAlign: "center",
            color: isLight ? homeBackground : background,
            fontSize: 22,
          }}
        >
          Page not implemented yet
        </Text>
        <View style={{ flex: 1 }} />
      </View>
      <NavBar />
    </View>
  )
}
