import { BoxShadowView } from "components/BoxShadow"
import { NavBar } from "components/NavBar"
import { FC } from "react"
import { View, StyleSheet } from "react-native"
import { Text, Title } from "components/Text"
import { usePalette } from "utils/colors"
import { ToggleSwitch, ToggleSwitchProps } from "components/ToggleSwitch"

export interface PageWrapProps {
  /**
   * Title of the page, can be a string or an tuple of strings.
   * If it's a tuple, the first string will be in a lighter font.
   */
  title?: string | [string, string] | null

  /**
   * Title to be displayed above the page, in the top left corner.
   * @default undefined
   */
  upperTitle?: string

  /**
   * Controls for a toggle switch on the right of the title, displays nothing if
   * not provided.
   */
  switchControl?: ToggleSwitchProps

  children: React.ReactNode
}

/**
 * Wrapper for a generic page, just gives the right background, shadow and styles.
 * Also has a title and a switch control for where it's needed.
 */
export const PageWrap: FC<PageWrapProps> = props => {
  const { homeBackground, background, isLight, palette } = usePalette()

  return (
    <View style={[{ backgroundColor: homeBackground }, styles.container]}>
      {props.upperTitle && (
        <View style={styles.upperTitleWrapper}>
          <Text
            style={[
              { color: isLight ? "#fff" : palette.accent },
              styles.upperTitle,
            ]}
          >
            {props.upperTitle}
          </Text>
        </View>
      )}

      <BoxShadowView
        shadow={{
          color: "#000",
          offset: { y: -8 },
          opacity: 0.45,
          blur: 32,
        }}
        style={styles.boxShadow}
        contentContainerStyle={[
          { backgroundColor: background },
          styles.boxShadowContainer,
        ]}
      >
        {props.title && (
          <View style={styles.titleWrapper}>
            {typeof props.title === "string" ? (
              <Title>{props.title}</Title>
            ) : (
              <Title>
                <Title style={{ fontFamily: "Roboto_300Light" }}>
                  {props.title[0] + " "}
                </Title>
                {props.title[1]}
              </Title>
            )}
            {props.switchControl && (
              <View style={styles.switch}>
                <ToggleSwitch
                  value={props.switchControl.value}
                  onValueChange={props.switchControl.onValueChange}
                />
              </View>
            )}
          </View>
        )}

        {props.children}
      </BoxShadowView>
      <NavBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switch: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  upperTitleWrapper: {
    position: "absolute",
    top: 56,
    left: 26,
    zIndex: 10,
  },
  upperTitle: {
    fontSize: 24,
    fontWeight: "900",
  },
  boxShadow: {
    flex: 1,
    marginTop: 100,
    overflow: "visible",
  },
  boxShadowContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "visible",
  },
  titleWrapper: {
    padding: 28,
    paddingBottom: 0,
    flexDirection: "row",
  },
})
