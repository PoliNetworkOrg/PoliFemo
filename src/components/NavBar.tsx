import React, { FC } from "react"
import { Dimensions, Pressable, View, StyleSheet } from "react-native"
import { useNavigation } from "../navigation/NavigationTypes"
import { usePalette } from "../utils/colors"
import { Text } from "./Text"

import { NavbarIcon, icons } from "../../assets/navbar"

const { Home, Back } = icons

const styles = StyleSheet.create({
    button: {
        height: 32,
        minWidth: 32,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        borderRadius: 50,
        margin: 10, // TODO: check dimensions
    },
})

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
    const navigation = useNavigation()
    const { buttonFill, background } = usePalette()

    const back = props.back ?? true
    const home = props.home ?? true

    const elevated = props.elevated ?? true

    return (
        <View
            style={[
                {
                    backgroundColor: background,
                    position: "absolute",
                    width: Dimensions.get("window").width,
                    bottom: 0,

                    zIndex: 3,
                    padding: 14,
                    paddingBottom: 36,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                },
                elevated
                    ? {
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
                      }
                    : {},
            ]}
        >
            {/* TODO: substitute with actual buttons */}
            {back && (
                <Pressable
                    onPress={
                        props.overrideBackBehavior ??
                        (() => navigation.goBack())
                    }
                    style={[
                        styles.button,
                        {
                            backgroundColor: buttonFill,
                            // justifyContent: "flex-end",
                            position: "relative",
                            width: 103,
                        },
                    ]}
                >
                    <Back style={{ marginLeft: 12, marginRight: "auto" }} />
                    {/* <Image
                        source={icons["back"]}
                        style={{ marginLeft: 12, marginRight: "auto" }}
                    /> */}
                    <Text style={{ marginLeft: "auto", marginRight: 20 }}>
                        Back
                    </Text>
                </Pressable>
            )}

            {home && (
                <Pressable
                    onPress={
                        props.overrideHomeBehavior ??
                        (() => navigation.navigate("Home"))
                    }
                    style={[styles.button, { backgroundColor: buttonFill }]}
                >
                    <Home />
                </Pressable>
            )}

            {props.customButtons
                ? props.customButtons.map(({ icon, onPress }, i) => {
                      const Icon = icons[icon]
                      return (
                          <Pressable
                              key={"navbar-custom-button-" + i}
                              style={[
                                  styles.button,
                                  {
                                      backgroundColor: buttonFill,
                                      marginLeft: "auto",
                                  },
                              ]}
                              onPress={onPress}
                          >
                              <Icon />
                          </Pressable>
                      )
                  })
                : undefined}
        </View>
    )
}
