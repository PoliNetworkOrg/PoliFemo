import React, { FC } from "react"
import { RefreshControl, ScrollView, View } from "react-native"

import { Title, Subtitle } from "components/Text"
import { NavBar, NavbarProps } from "components/NavBar"
import { usePalette } from "utils/colors"

/**
 * General component useful for pages with a scrollable content.
 * It provides a navbar and a scrollview with margin and rounded corners.
 */
export const ArticleScroll: FC<{
    /**
     * Title in the sticky header.
     */
    title?: string
    /**
     * Subtitle in the sticky header.
     */
    subtitle?: string
    /**
     * Remove the navbar from the bottom of the page.
     */
    hideNavbar?: boolean
    /**
     * Props for the navbar, see {@link NavBar}
     */
    navbarOptions?: NavbarProps
    /**
     * Element to be put behind the page, the main content will scroll on top of it.
     */
    backdropElement?: React.ReactNode
    /**
     * Margin above the title to leave space for the backdrop element.
     */
    scrollOffset?: number
    /**
     * props for the refresh control
     */
    refreshControl?: {
        onRefresh: () => void
        refreshing: boolean
    }
    children: React.ReactNode
}> = props => {
    const { background, homeBackground } = usePalette()

    const navbar = !props.hideNavbar

    return (
        <View style={{ flex: 1, backgroundColor: homeBackground }}>
            {props.backdropElement && (
                <View
                    style={{
                        height: 230,
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        zIndex: 0,

                        /* justifyContent: "flex-start", */
                        /*   alignItems: "flex-start", */
                    }}
                >
                    {props.backdropElement}
                </View>
            )}
            <View
                style={{
                    backgroundColor: background,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    marginTop: 192,
                    paddingHorizontal: 28,
                    paddingTop: 8,
                }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        props.refreshControl ? (
                            <RefreshControl
                                refreshing={props.refreshControl.refreshing}
                                onRefresh={props.refreshControl.onRefresh}
                            />
                        ) : undefined
                    }
                >
                    <View>
                        <Title
                            style={{
                                fontSize: 42,
                                fontFamily: "Roboto_900Black",
                            }}
                        >
                            {props.title}
                        </Title>
                        {props.subtitle && (
                            <Subtitle style={{ paddingLeft: 8 }}>
                                {props.subtitle}
                            </Subtitle>
                        )}
                    </View>

                    <View>{props.children}</View>
                </ScrollView>
            </View>
            {navbar ? <NavBar {...props.navbarOptions} /> : null}
        </View>
    )
}
