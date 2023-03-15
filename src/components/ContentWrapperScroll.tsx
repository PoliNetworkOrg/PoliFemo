import React, { FC } from "react"
import { ScrollView, View } from "react-native"
import { Text } from "components/Text"
import { NavBar, NavbarProps } from "components/NavBar"
import { usePalette } from "utils/colors"
import { BoxShadowView } from "./BoxShadow"
import { ButtonInterface } from "./Home"

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

  buttonsNavbar?: ButtonInterface[]
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

      <BoxShadowView
        shadow={{
          color: isLight ? palette.primary : "#000",
          offset: { y: -8 },
          opacity: isLight ? 0.1 : 0.45,
          blur: isLight ? 19 : 32,
        }}
        style={{
          flex: 1,
          marginTop: props.marginTop ?? 86,
        }}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          overflow: "hidden",
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: 50 }}>{props.children}</View>
        </ScrollView>
      </BoxShadowView>
      {navbar ? (
        <NavBar {...props.navbarOptions} buttonsNavbar={props.buttonsNavbar} />
      ) : null}
    </View>
  )
}
