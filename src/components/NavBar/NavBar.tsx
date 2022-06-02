import React, { FC } from "react"
import { Dimensions, Pressable, View, StyleSheet, Image } from "react-native"
import { useNavigation } from "../../navigation/NavigationTypes"
import { usePalette } from "../../utils/colors"
import { Text } from "../Text"

import { NavbarIcon, useNavbarIcon } from "../../../assets/navbar"

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
                    onPress={() => navigation.goBack()}
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
                    <Image
                        source={useNavbarIcon("back")}
                        style={{ marginLeft: 12, marginRight: "auto" }}
                    />
                    <Text style={{ marginLeft: "auto", marginRight: 20 }}>
                        Back
                    </Text>
                </Pressable>
            )}

            {home && (
                <Pressable
                    onPress={() => navigation.navigate("Home")}
                    style={[styles.button, { backgroundColor: buttonFill }]}
                >
                    <Image source={useNavbarIcon("home")} />
                </Pressable>
            )}

            {props.customButtons
                ? props.customButtons.map(({ icon, onPress }, i) => (
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
                          <Image source={useNavbarIcon(icon)} />
                      </Pressable>
                  ))
                : undefined}
        </View>
    )
}
