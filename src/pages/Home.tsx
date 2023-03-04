import { useState } from "react"
import { View } from "react-native"

import { NewsManager } from "components/Home/News"
import { MainStackScreen } from "navigation/NavigationTypes"
import { MainMenu, MainTitle, PoliSearchBar } from "components/Home"
import { HighlightsManager } from "components/Home/Highlights/HighlightsManager"
import { usePalette } from "utils/colors"

/**
 * Home page containing the POLIFEMO logo, search bar, main horizontal scroll menu and the entry
 * point for the news section (which is a bottom sheet)
 */
export const Home: MainStackScreen<"Home"> = () => {
  const { homeBackground, background } = usePalette()

  const [search, setSearch] = useState("")

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
        <View
          // section containing the search bar and the main menu
          style={{
            marginTop: 35,
            paddingBottom: 300,
            backgroundColor: background,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.43,
            shadowRadius: 9.51,

            elevation: 15,
          }}
        >
          <PoliSearchBar onChange={searchKey => setSearch(searchKey)} />
          <MainMenu filter={search} />
          <HighlightsManager />
        </View>
      </View>
      <NewsManager />
    </View>
  )
}
