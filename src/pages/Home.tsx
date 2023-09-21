import { View } from "react-native"

import { NewsManager } from "components/Home/News"
import { MainStackScreen } from "navigation/NavigationTypes"
import { MainMenu, MainTitle, SearchButton } from "components/Home"
import { HighlightsManager } from "components/Home/Highlights/HighlightsManager"
import { usePalette } from "utils/colors"
import { BoxShadowView } from "components/BoxShadow"

/**
 * Home page containing the POLIFEMO logo, search bar, main horizontal scroll menu and the entry
 * point for the news section (which is a bottom sheet)
 */
export const Home: MainStackScreen<"Home"> = () => {
  const { homeBackground, background } = usePalette()

  return (
    <View
      style={{
        flex: 1,
        alignItems: "stretch",
        backgroundColor: homeBackground,
      }}
    >
      <View
        style={{
          flex: 1,
          marginTop: 106,
        }}
      >
        <MainTitle />
        <BoxShadowView
          shadow={{
            offset: { y: -8 },
            opacity: 0.2,
            blur: 19,
          }}
          // section containing the search bar and the main menu
          style={{
            marginTop: 35,
          }}
          contentContainerStyle={{
            paddingBottom: 300,
            backgroundColor: background,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <SearchButton />
          <MainMenu />
          <HighlightsManager />
        </BoxShadowView>
      </View>
      <NewsManager />
    </View>
  )
}
