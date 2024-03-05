import { FC } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { BoxShadowCanvas } from "components/BoxShadow"
import { usePalette } from "utils/colors"

const offset = 79

/**
 * this needs to be a separate component because declearing it inline changes its
 * reference and the shadows get all fucky if you keep re-rendering them
 */
export const CalendarBottomSheetHandle: FC = () => {
  const { background } = usePalette()

  return (
    <View
      style={{
        position: "absolute",
        top: -offset,
        paddingTop: offset,
        height: offset + 30,
        overflow: "hidden",
        width: Dimensions.get("window").width,
      }}
    >
      <View style={{ flex: 1 }}>
        <BoxShadowCanvas
          shadow={{
            color: "#000",
            offset: { y: -8 },
            opacity: 0.45,
            blur: 32,
          }}
          canvasStyle={{ marginTop: 1 }}
          canvasDimensions={{
            width: Dimensions.get("window").width,
            height: 30,
            radii: [30, 30, 0, 0],
          }}
        />
        <View style={[styles.topBar, { backgroundColor: background }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topBar: {
    justifyContent: "center",
    paddingHorizontal: 26,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 8,
    height: 60,
  },
})
