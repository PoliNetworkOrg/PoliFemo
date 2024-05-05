import { PageWrap } from "components/PageLayout"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { FlatList, View } from "react-native"
import webeepsvg from "assets/materials/webeep.svg"
import { Icon } from "components/Icon"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { mockCourses } from "api/moodle"
import { CardWithGradient } from "components/CardWithGradient"
import { StackActions } from "@react-navigation/native"

/**
 * Materials Page
 */
export const WebeepCourses: MainStackScreen<"WebeepCourses"> = () => {
  const { palette } = usePalette()

  const navigation = useNavigation()

  return (
    <>
      <PageWrap
        upperTitle={""}
        title={"Courses"}
        sideTitleElement={
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-end",
              flex: 1,
              paddingBottom: 10,
            }}
          >
            <Icon source={webeepsvg} scale={0.35} />
          </View>
        }
        overrideBackBehaviour={() => {
          navigation.dispatch(StackActions.pop(2))
        }}
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            marginHorizontal: 32,
            marginBottom: 90,
          }}
        >
          <BodyText
            style={{
              marginBottom: 16,
              fontSize: 20,
              fontWeight: "700",
              color: palette.primary,
            }}
          >
            Ingegneria Aerospaziale 1° anno
          </BodyText>
          <FlatList
            numColumns={2}
            data={mockCourses}
            renderItem={course => (
              <CardWithGradient
                title={course.item.name}
                imageURL={course.item?.image}
                onClick={() => {
                  navigation.navigate("WebeepCourseDetails", {
                    course: course.item,
                  })
                }}
                style={{
                  height: 150,
                  marginBottom: 13,
                  flex: 1,
                  marginHorizontal: 8,
                }}
              />
            )}
          />
        </View>
      </PageWrap>
    </>
  )
}
