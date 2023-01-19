import React, { FC } from "react"
import { ScrollView, View, ViewStyle } from "react-native"
import { NavBar, NavbarProps } from "components/NavBar"
import { usePalette } from "utils/colors"

/**
 * Page Wrapper for Class Details page, maybe unify this with Settings Wrapper or any other wrapper
 * somewhere in the app.
 */
export const PageWrapper: FC<{
    hideNavbar?: boolean
    /**
     * Props for the navbar, see {@link NavBar}
     */
    navbarOptions?: NavbarProps

    style?: ViewStyle

    children: React.ReactNode
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
                style={{
                    backgroundColor: background,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    marginTop: 106,
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
                    <View style={props.style}>{props.children}</View>
                </ScrollView>
            </View>

            {navbar ? <NavBar {...props.navbarOptions} /> : null}
        </View>
    )
}
