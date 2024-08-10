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
import longArrowLeftSvg from "assets/materials/long_arrow_left.svg"
import downloadsSvg from "assets/tray/downloads.svg"
import eyeSvg from "assets/materials/eye.svg"
import { useMemo, useState } from "react"
import { MockFolder } from "api/moodle"
import { isFolderInArray } from "utils/materials"

/**
 * Materials Page
 */
export const WebeepCourseDetails: MainStackScreen<
  "WebeepCourseDetails"
> = props => {
  const { palette } = usePalette()

  const { course } = props.route.params

  const [startingFolder, setStartingFolder] = useState(course.folder)

  const [currentFolder, setCurrentFolder] = useState(course.folder)

  const [historyFolders, setHistoryFolders] = useState<MockFolder[]>([])

  const lastHistoryFolder = useMemo(() => {
    return historyFolders.length > 0
      ? historyFolders[historyFolders.length - 1]
      : null
  }, [historyFolders])

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
        {currentFolder &&
          lastHistoryFolder &&
          currentFolder.fullpath != startingFolder.fullpath && (
            <Pressable
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
                setCurrentFolder(lastHistoryFolder)
                historyFolders.pop()
                setHistoryFolders([...historyFolders])
              }}
            >
              <View style={{ width: 24 }}>
                <Icon source={folderSvg} />
              </View>
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
                  {currentFolder.name}
                </BodyText>
                <Icon source={longArrowLeftSvg} />
              </View>
            </Pressable>
          )}

        {currentFolder.folders.map((folder, _) => (
          <Pressable
            key={folder.fullpath}
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
              if (!isFolderInArray(folder, historyFolders)) {
                setHistoryFolders([...historyFolders, currentFolder])
                setCurrentFolder(folder)
              }
            }}
          >
            <View style={{ width: 24 }}>
              <Icon source={folderSvg} />
            </View>
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

        {currentFolder.files.map((file, _) => (
          <Pressable
            key={file.fullpath}
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
            <View style={{ width: 24 }}>
              <Icon source={fileSvg} />
            </View>
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
