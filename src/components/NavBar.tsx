import { FC } from "react"
import { Pressable, View, StyleSheet } from "react-native"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text } from "components/Text"
import { useNavigation } from "navigation/NavigationTypes"
import { usePalette } from "utils/colors"
import { NavbarIcon, navbarIcons } from "assets/navbar"
import { newsSheetEventEmitter } from "utils/events"

export interface NavbarProps {
  /**
   * render the Back Button
   * @default true
   */
  back?: boolean
  /**
   * render the Home Button
   * @default true
   */
  home?: boolean
  /**
   * An array with custom buttons that will be rendered to the right of the navbar
   */
  customButtons?: {
    /**
     * the name of the icon from the {@link navbarIconList}
     */
    icon: NavbarIcon
    /**
     * callbeck when the button is pressed
     */
    onPress: () => void
  }[]
  /**
   * whether or not to render the navbar as elevated with a shadow and rounded corners
   * @default true
   */
  elevated?: boolean

  /**
   * overrides the default navigation "goBack" behavior
   */
  overrideBackBehavior?: () => void
  /**
   * overrides the default navigation "navigate" to home behavior
   */
  overrideHomeBehavior?: () => void
}

/**
 * The navigation bar at the bottom of the screen, has a back and home button, and an optional
 * download button
 */
export const NavBar: FC<NavbarProps> = props => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { buttonFill, background } = usePalette()

  const back = props.back ?? true
  const home = props.home ?? true

  const homeSVG = useSVG(navbarIcons.home.svg)
  const backSVG = useSVG(navbarIcons.back.svg)

  const elevated = props.elevated ?? true

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: background,
          paddingBottom: insets.bottom ? insets.bottom + 10 : undefined,
        },
        elevated ? styles.wrapperElevated : {},
      ]}
    >
      {back && (
        <Pressable
          onPress={props.overrideBackBehavior ?? (() => navigation.goBack())}
          style={[
            styles.button,
            {
              backgroundColor: buttonFill,
              width: 103,
              marginRight: 19,
            },
          ]}
        >
          <Canvas
            style={{
              marginLeft: 9,
              marginRight: "auto",
              width: navbarIcons.back.width,
              height: navbarIcons.back.heigth,
            }}
          >
            {backSVG && (
              <ImageSVG
                svg={backSVG}
                x={0}
                y={0}
                width={navbarIcons.back.width}
                height={navbarIcons.back.heigth}
              />
            )}
          </Canvas>
          <Text
            style={{
              fontWeight: "900",
              marginRight: 20,
              marginLeft: "auto",
              lineHeight: 19,
              height: 19,
            }}
          >
            Back
          </Text>
        </Pressable>
      )}

      {home && (
        <Pressable
          onPress={
            props.overrideHomeBehavior ??
            (() => {
              navigation.navigate("Home")
              // Emit the event to close the news bottom sheet
              newsSheetEventEmitter.emit("should_close")
            })
          }
          style={[styles.button, { backgroundColor: buttonFill }]}
        >
          <Canvas
            style={{
              marginLeft: 8,
              marginRight: "auto",
              width: navbarIcons.home.width,
              height: navbarIcons.home.heigth,
            }}
          >
            {homeSVG && (
              <ImageSVG
                svg={homeSVG}
                x={0}
                y={0}
                width={navbarIcons.home.width}
                height={navbarIcons.home.heigth}
              />
            )}
          </Canvas>
        </Pressable>
      )}

      <View
        // wrapper for right buttons
        style={{ flexDirection: "row", marginLeft: "auto" }}
      >
        {!!props.customButtons &&
          props.customButtons.map(({ icon, onPress }, i) => {
            const iconSVG = navbarIcons[icon]
            const svg = useSVG(iconSVG.svg)
            return (
              <Pressable
                key={"navbar-custom-button-" + i}
                style={[
                  styles.button,
                  {
                    backgroundColor: buttonFill,
                    marginLeft: 19,
                  },
                ]}
                onPress={onPress}
              >
                <Canvas
                  style={{
                    width: iconSVG.width,
                    height: iconSVG.heigth,
                  }}
                >
                  {svg && (
                    <ImageSVG
                      svg={svg}
                      x={0}
                      y={0}
                      width={iconSVG.width}
                      height={iconSVG.heigth}
                    />
                  )}
                </Canvas>
              </Pressable>
            )
          })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    zIndex: 3,
    paddingHorizontal: 25,
    paddingVertical: 30,

    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  wrapperElevated: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8.3,
    elevation: 13,
  },
  button: {
    height: 32,
    minWidth: 33,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
})
