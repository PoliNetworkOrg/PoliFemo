import React, { FC } from "react"
import { View, StyleSheet } from "react-native"
import { BoxShadowCanvas } from "components/BoxShadow"
import { Title } from "components/Text"
import { usePalette } from "utils/colors"

/**
 * this needs to be a separate component because declearing it inline changes its
 * reference and the shadows get all fucky if you keep re-rendering them
 */
export const NewsBottomSheetHandle: FC = () => {
  const { background, isLight, palette } = usePalette()

  return (
    <View>
      <BoxShadowCanvas
        shadow={{
          opacity: isLight ? 0.2 : 0.37,
          offset: { y: isLight ? -5 : -8 },
          blur: isLight ? 12 : 35,
          spread: isLight ? 0 : 9,
          color: isLight ? palette.primary : "#000",
        }}
        canvasStyle={{ marginTop: 1 }}
        siblingViewStyle={{
          borderTopLeftRadius: 33,
          borderTopRightRadius: 33,
        }}
      />
      <View style={[styles.topBar, { backgroundColor: background }]}>
        <View
          style={[
            styles.dragBar,
            {
              backgroundColor: isLight
                ? "rgba(135, 145, 189, 0.5)"
                : palette.primary,
            },
          ]}
        />
        <Title style={{ fontFamily: "Roboto_700Bold", fontSize: 48 }}>
          News
        </Title>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 26,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 8,
  },
  dragBar: {
    alignSelf: "center",
    width: 120,
    height: 5,
    marginVertical: 16,
    borderRadius: 4,
  },
})
