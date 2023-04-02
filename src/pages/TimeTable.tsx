import { NavBar } from "components/NavBar"
import { LectureCard } from "components/TimeTable/LectureCard"
import { MainStackScreen } from "navigation/NavigationTypes"
import { View } from "react-native"
import { usePalette } from "utils/colors"

/**
 * Home page containing the POLIFEMO logo, search bar, main horizontal scroll menu and the entry
 * point for the news section (which is a bottom sheet)
 */
export const TimeTable: MainStackScreen<"TimeTable"> = () => {
  const { background, isLight, homeBackground } = usePalette()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: !isLight ? background : homeBackground,
      }}
    >
      <View>
        <LectureCard
          name="B2.2.2 - FUNDAMENTALS OF ELECTRONICS FOR DESIGN"
          borderColor="#52E8F2"
        />
      </View>
      <NavBar />
    </View>
  )
}
