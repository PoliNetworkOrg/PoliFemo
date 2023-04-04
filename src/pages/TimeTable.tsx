/* eslint-disable @typescript-eslint/naming-convention */
import { NavBar } from "components/NavBar"
import { MainStackScreen } from "navigation/NavigationTypes"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { TimeTableGrid } from "components/TimeTable/TimeTableGrid"

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
      <TimeTableGrid />
      <NavBar />
    </View>
  )
}
