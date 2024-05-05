import { ScrollPage } from "components/PageLayout"
import { MainStackScreen } from "navigation/NavigationTypes"
import { Pressable, View } from "react-native"
import webeepsvg from "assets/materials/webeep.svg"
import { Icon } from "components/Icon"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import folderSvg from "assets/materials/folder.svg"
import fileSvg from "assets/materials/file.svg"
import longArrowRightSvg from "assets/materials/long_arrow_right.svg"
import downloadsSvg from "assets/tray/downloads.svg"
import eyeSvg from "assets/materials/eye.svg"

/**
 * Materials Page
 */
export const WebeepCourseDetails: MainStackScreen<
  "WebeepCourseDetails"
> = props => {
  const { palette } = usePalette()

  const { course } = props.route.params

  return (
    <>
      <ScrollPage
        upperTitle={""}
        title={course.name}
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
        contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 32 }}
      >
        {course.folder.folders.map((folder, index) => (
          <Pressable
            key={index}
            style={{
              backgroundColor: palette.primary,
              borderRadius: 16,
              flex: 1,
              height: 42,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              marginBottom: 8,
            }}
            onPress={() => {
              // do smth
            }}
          >
            <Icon source={folderSvg} />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BodyText
                style={{
                  marginLeft: 16,
                  fontSize: 16,
                  fontWeight: "500",
                  color: "white",
                }}
              >
                {folder.name}
              </BodyText>
              <Icon source={longArrowRightSvg} />
            </View>
          </Pressable>
        ))}

        {course.folder.files.map((file, index) => (
          <Pressable
            key={course.folder.folders.length + index}
            style={{
              backgroundColor: palette.lighter,
              borderRadius: 16,
              flex: 1,
              height: 42,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              marginBottom: 8,
            }}
            onPress={() => {
              // do smth
            }}
          >
            <Icon source={fileSvg} />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BodyText
                style={{
                  marginLeft: 16,
                  fontSize: 16,
                  fontWeight: "500",
                  color: "white",
                }}
              >
                {file.name}
              </BodyText>
              <View style={{ flexDirection: "row" }}>
                <Icon source={eyeSvg} color="white" />
                <View style={{ width: 12 }} />
                <Icon source={downloadsSvg} color="white" />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollPage>
    </>
  )
}
