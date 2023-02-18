import React, { FC } from "react"
import { View, ViewStyle } from "react-native"
import { NavBar, NavbarProps } from "components/NavBar"
import { usePalette } from "utils/colors"

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
  style?: ViewStyle
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
      <View
        style={[
          {
            backgroundColor: background,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginTop: props.marginTop ?? 100,
            flex: 1,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 8.3,
            elevation: 13,
          },
          props.style,
        ]}
      >
        {props.children}
      </View>
      {navbar ? <NavBar {...props.navbarOptions} /> : null}
    </View>
  )
}
