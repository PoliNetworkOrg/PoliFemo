import React, { FC, useEffect, useRef } from "react"
import { RefreshControl, ScrollView, View, Animated } from "react-native"

import { Title, Subtitle } from "components/Text"
import { NavBar, NavbarProps } from "components/NavBar"
import { usePalette } from "utils/colors"

/**
 * General component useful for pages with a scrollable content.
 * It provides a navbar and a scrollview with margin and rounded corners.
 */
export const Page: FC<{
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
    const [isPastTitle, setIsPastTitle] = React.useState(false)
    const shadowAnim = useRef(new Animated.Value(0)).current

    const navbar = !props.hideNavbar

    const showHeader = props.title !== undefined

    useEffect(() => {
        // hook called when the shadown needs to be animated
        const duration = 100
        if (isPastTitle)
            Animated.timing(shadowAnim, {
                toValue: 1,
                duration,
                useNativeDriver: true,
            }).start()
        else
            Animated.timing(shadowAnim, {
                toValue: 0,
                duration,
                useNativeDriver: true,
            }).start()
    }, [isPastTitle, shadowAnim])

    return (
        <View style={{ flex: 1, backgroundColor: homeBackground }}>
            {props.backdropElement && (
                // element at the top of the screen, above the page
                <View
                    style={{
                        height: 200,
                        width: "100%",
                        backgroundColor: homeBackground,
                        position: "absolute",
                        zIndex: -1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {props.backdropElement}
                </View>
            )}
            <View
                // wrapper to make the borders of every child rounded
                style={{
                    flex: 1,
                    marginTop: 106 + (props.scrollOffset || 0),
                    backgroundColor: background,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    overflow: "hidden",
                }}
            >
                <ScrollView
                    refreshControl={
                        props.refreshControl ? (
                            <RefreshControl
                                refreshing={props.refreshControl.refreshing}
                                onRefresh={props.refreshControl.onRefresh}
                            />
                        ) : undefined
                    }
                    stickyHeaderIndices={props.title ? [0] : undefined} // first child is the sticky header
                    scrollEventThrottle={100}
                    onScroll={
                        showHeader
                            ? e => {
                                  const scollThreshold =
                                      20 + (props.scrollOffset || 0)
                                  if (
                                      e.nativeEvent.contentOffset.y >=
                                          scollThreshold &&
                                      !isPastTitle
                                  )
                                      setIsPastTitle(true)
                                  else if (
                                      e.nativeEvent.contentOffset.y <
                                          scollThreshold &&
                                      isPastTitle
                                  )
                                      setIsPastTitle(false)
                              }
                            : undefined
                    }
                >
                    {showHeader && (
                        // Sticky page header with the title and subtitle
                        <Animated.View
                            style={{
                                backgroundColor: background,
                                zIndex: 1000,
                                paddingHorizontal: 28,
                                paddingVertical: 22,
                                borderTopLeftRadius: 30,
                                borderTopRightRadius: 30,

                                shadowColor: isPastTitle ? "#0003" : undefined,
                                shadowOffset: {
                                    width: 0,
                                    height: 3,
                                },
                                shadowRadius: 4.65,
                                shadowOpacity: Animated.multiply(
                                    shadowAnim,
                                    0.27
                                ),
                            }}
                        >
                            <Title>{props.title}</Title>
                            {props.subtitle && (
                                <Subtitle>{props.subtitle}</Subtitle>
                            )}
                        </Animated.View>
                    )}
                    <View
                        // wrapper of the scrollable content
                        style={{
                            flex: 1,
                            backgroundColor: background,
                            paddingHorizontal: 28,
                            paddingBottom: 120,
                            paddingTop: !showHeader ? 30 : 0,
                        }}
                    >
                        {props.children}
                    </View>
                </ScrollView>
            </View>
            {navbar ? <NavBar {...props.navbarOptions} /> : null}
        </View>
    )
}
