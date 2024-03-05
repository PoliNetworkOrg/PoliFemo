import { Title } from "components/Text"
import { SettingsStackScreen } from "navigation/NavigationTypes"
import { SectionList } from "react-native"
import { palette, usePalette } from "utils/colors"
import contributors from "./contributors.json"
import { ContributorTile } from "./ContributorTile"
import { PageWrap } from "components/PageLayout"

enum ContributionType {
  MANAGEMENT = "projectManagement",
  CODE = "code",
  DESIGN = "design",
}

export const Contributors: SettingsStackScreen<"Contributors"> = () => {
  const { isLight } = usePalette()

  /* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
  const managementContributors = contributors.filter(
    c => c.contributions[0] === ContributionType.MANAGEMENT
  )

  const codingContributors = contributors.filter(
    c => c.contributions[0] === ContributionType.CODE
  )
  const designContributors = contributors.filter(
    c => c.contributions[0] === ContributionType.DESIGN
  )
  // const otherContributors = contributors.filter(
  //   c =>
  //     c.contributions[0] !== ContributionType.DESIGN &&
  //     c.contributions[0] !== ContributionType.CODE &&
  //     c.contributions[0] !== ContributionType.MANAGEMENT
  // )

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
    // {
    //   title: "Others",
    //   data: otherContributors,
    // },
  ]

  return (
    <PageWrap upperTitle="Contributors">
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingTop: 30,
          paddingHorizontal: 28,
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Title
            style={{
              marginBottom: 12,
              fontSize: 24,
              fontWeight: "500",
              color: isLight ? palette.primary : palette.accent,
            }}
          >
            {title}
          </Title>
        )}
        renderItem={({ item, index, section }) => (
          <ContributorTile
            login={item.login}
            name={item.name}
            avatar_url={item.avatar_url}
            profile={item.profile}
            contributions={item.contributions}
            key={"contributor-" + section.title + " -" + index}
          />
        )}
      />
    </PageWrap>
  )
}
