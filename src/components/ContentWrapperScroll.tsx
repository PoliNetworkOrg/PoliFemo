import React, { FC } from "react"
import { ScrollView, View } from "react-native"
import { Text } from "components/Text"
import { NavBar, NavbarProps } from "components/NavBar"
import { usePalette } from "utils/colors"

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
  marginTop?: number
}> = props => {
  const { background, isLight, primary } = usePalette()

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
            top: 42,
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

      <View
        style={{
          backgroundColor: background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: props.marginTop ?? 86,
          zIndex: 2,
          flex: 1,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 8.3,
          elevation: 13,
          overflow: "hidden",
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>{props.children}</View>
        </ScrollView>
      </View>
      {navbar ? <NavBar {...props.navbarOptions} /> : null}
    </View>
  )
}
