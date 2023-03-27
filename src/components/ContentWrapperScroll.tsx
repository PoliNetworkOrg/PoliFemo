import React, { FC } from "react"
import { ScrollView, View, ViewStyle } from "react-native"
import { Text } from "components/Text"
import { NavBar, NavbarProps } from "components/NavBar"
import { usePalette } from "utils/colors"
import { BoxShadowView } from "./BoxShadow"

/**
 * General component useful for pages with a scrollable content.
 * It provides a navbar and a scrollview with margin and rounded corners.
 * Default margin Top is 86 (proper margin for Settings Page)
 */
export const ContentWrapperScroll: FC<{
  children: React.ReactNode

  title?: string
  /**
   * Remove the navbar from the bottom of the page.
   */
  hideNavbar?: boolean
  /**
   * Props for the navbar, see {@link NavBar}
   */
  navbarOptions?: NavbarProps

  style?: ViewStyle

  scrollViewStyle?: ViewStyle
}> = props => {
  const { background, isLight, primary, palette } = usePalette()

  const navbar = !props.hideNavbar

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isLight ? primary : background,
      }}
    >
      {props.title && (
        <View
          style={{
            position: "absolute",
            top: 56,
            left: 26,
            zIndex: 6,
          }}
        >
          <Text
            style={{
              color: isLight ? "#fff" : primary,
              fontSize: 24,
              fontWeight: "900",
            }}
          >
            {props.title}
          </Text>
        </View>
      )}

      <BoxShadowView
        shadow={{
          color: isLight ? palette.primary : "#000",
          offset: { y: -8 },
          opacity: isLight ? 0.1 : 0.45,
          blur: isLight ? 19 : 32,
        }}
        style={[
          {
            flex: 1,
            marginTop: 100,
          },
          props.style,
        ]}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          overflow: "hidden",
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { overflow: "visible" },
            props.scrollViewStyle,
          ]}
        >
          <View style={{ paddingBottom: 50 }}>{props.children}</View>
        </ScrollView>
      </BoxShadowView>
      {navbar ? <NavBar {...props.navbarOptions} /> : null}
    </View>
  )
}
