import { PageWrap } from "components/PageLayout"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { Pressable, View } from "react-native"
import webeepsvg from "assets/materials/webeep.svg"
import gitlabsvg from "assets/materials/gitlab.svg"
import { Icon } from "components/Icon"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"

/**
 * Materials Page
 */
export const MaterialsPage: MainStackScreen<"Materials"> = () => {
  const { palette } = usePalette()
  const { navigate } = useNavigation()

  return (
    <>
      <PageWrap upperTitle={""} title={"Materials"}>
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            marginHorizontal: 32,
            marginBottom: 120,
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              navigate("WebeepCourses")
            }}
          >
            <View
              style={{
                flex: 1,
                marginVertical: 16,
                backgroundColor: palette.primary,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 16,
                  borderRadius: 16,
                }}
              >
                <Icon source={webeepsvg} />
              </View>
            </View>
          </Pressable>
          <View
            style={{
              flex: 1,
              marginVertical: 16,
              backgroundColor: palette.primary,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <BodyText
              style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
            >
              GitLab
            </BodyText>
            <View
              style={{
                backgroundColor: "white",
                padding: 16,
                borderRadius: 16,
              }}
            >
              <Icon source={gitlabsvg} />
            </View>
            <BodyText
              style={{ fontSize: 14, fontWeight: "300", color: "white" }}
            >
              coming soon...
            </BodyText>
          </View>
        </View>
      </PageWrap>
    </>
  )
}
