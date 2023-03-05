import { FC } from "react"
import { Pressable, View, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text } from "components/Text"
import { useNavigation } from "navigation/NavigationTypes"
import { usePalette } from "utils/colors"
import { NavbarIcon, navbarIcons } from "assets/navbar"
import { newsSheetEventEmitter } from "utils/events"
import { Icon } from "./Icon"

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
          <Icon style={{ marginLeft: 9 }} source={navbarIcons.back} />
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
          <Icon source={navbarIcons.home} />
        </Pressable>
      )}

      <View
        // wrapper for right buttons
        style={{ flexDirection: "row", marginLeft: "auto" }}
      >
        {!!props.customButtons &&
          props.customButtons.map(({ icon, onPress }, i) => (
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
              <Icon source={navbarIcons[icon]} />
            </Pressable>
          ))}
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
