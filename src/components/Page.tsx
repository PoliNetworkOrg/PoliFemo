import React, { FC, useEffect, useRef } from "react"
import { RefreshControl, ScrollView, View, Animated } from "react-native"
import { usePalette } from "../utils/colors"
import { Title, Subtitle } from "./Text"
import { NavBar, NavbarProps } from "./NavBar"

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
                <View
                    style={{
                        height: 200,
                        width: "100%",
                        backgroundColor: homeBackground,
                        position: "absolute",
                        zIndex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {props.backdropElement}
                </View>
            )}
            <ScrollView
                refreshControl={
                    props.refreshControl ? (
                        <RefreshControl
                            refreshing={props.refreshControl.refreshing}
                            onRefresh={props.refreshControl.onRefresh}
                        />
                    ) : undefined
                }
                stickyHeaderIndices={props.title ? [0] : undefined}
                style={{
                    zIndex: 2,
                    overflow: "hidden",
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    marginTop: 106,
                }}
                contentContainerStyle={{
                    overflow: "hidden",
                }}
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
                    <Animated.View
                        style={{
                            marginTop: props.scrollOffset || 0,
                            flex: 1,
                            backgroundColor: background,
                            padding: 28,
                            zIndex: 1000,
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,

                            shadowColor: isPastTitle ? "#0003" : undefined,
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowRadius: 4.65,
                            shadowOpacity: Animated.multiply(shadowAnim, 0.27),
                            elevation: Animated.multiply(shadowAnim, 6),
                        }}
                    >
                        <Title>{props.title}</Title>
                        {props.subtitle && (
                            <Subtitle>{props.subtitle}</Subtitle>
                        )}
                    </Animated.View>
                )}
                <View
                    style={{
                        backgroundColor: background,
                        paddingHorizontal: 30,
                        paddingBottom: 130,
                        ...(!showHeader
                            ? {
                                  marginTop: props.scrollOffset || 0,
                                  paddingTop: 30,
                                  borderTopLeftRadius: 30,
                                  borderTopRightRadius: 30,
                              }
                            : {}),
                    }}
                >
                    {props.children}
                </View>
            </ScrollView>
            {navbar ? <NavBar {...props.navbarOptions} /> : null}
        </View>
    )
}
