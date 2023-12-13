import { BoxShadowView } from "components/BoxShadow"
import { NavBar } from "components/NavBar"
import { BodyText, Text } from "components/Text"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { SectionList, View } from "react-native"
import { palette, usePalette } from "utils/colors"
import contributors from "./contributors.json"
import { ContributorTile } from "./ContributorTile"

enum ContributionType {
  MANAGEMENT = "projectManagement",
  CODE = "code",
  DESIGN = "design",
}

export const Contributors: SettingsStackScreen<"Contributors"> = () => {
  const { homeBackground, isLight, primary, background } = usePalette()

  const managementContributors = contributors.filter(
    c => c.contributions[0] === ContributionType.MANAGEMENT
  )

  const codingContributors = contributors.filter(
    c => c.contributions[0] === ContributionType.CODE
  )
  const designContributors = contributors.filter(
    c => c.contributions[0] === ContributionType.DESIGN
  )

  const sections = [
    {
      title: "Management",
      data: managementContributors,
    },
    {
      title: "Development",
      data: codingContributors,
    },
    {
      title: "Design",
      data: designContributors,
    },
  ]

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
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 120,
            paddingTop: 30,
          }}
          renderSectionHeader={({ section: { title } }) => (
            <BodyText
              style={{
                marginBottom: 20,
                fontSize: 30,
                fontWeight: "500",
                color: isLight ? palette.primary : palette.accent,
              }}
            >
              {title}
            </BodyText>
          )}
          renderItem={({ item, index, section }) => (
            <ContributorTile
              login={item.login}
              name={item.name}
              avatar_url={item.avatar_url}
              profile={item.profile}
              contributions={item.contributions}
              key={"contributor-" + section + " -" + index}
            />
          )}
        />
      </BoxShadowView>
      <NavBar />
    </View>
  )
}
