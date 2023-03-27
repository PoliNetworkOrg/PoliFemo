import React, { FC } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { NavBar, NavbarProps } from "components/NavBar"
import { usePalette } from "utils/colors"
import { BoxShadowView } from "components/BoxShadow"

/**
 * Groups page Wrapper
 */
export const PageWrapper: FC<{
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
  style?: StyleProp<ViewStyle>
}> = props => {
  const { background, isLight, palette } = usePalette()

  const navbar = !props.hideNavbar

  return (
    <BoxShadowView
      shadow={{
        color: isLight ? palette.primary : "#000",
        offset: { y: -8 },
        opacity: isLight ? 0.1 : 0.45,
        blur: isLight ? 19 : 32,
      }}
      style={{
        flex: 1,
        marginTop: props.marginTop ?? 100,
      }}
      contentContainerStyle={[
        {
          flex: 1,
          backgroundColor: background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          overflow: "hidden",
        },
        props.style,
      ]}
    >
      {props.children}
      {navbar ? <NavBar {...props.navbarOptions} /> : null}
    </BoxShadowView>
  )
}
