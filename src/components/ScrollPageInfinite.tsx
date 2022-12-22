import React, { FC, useEffect, useRef, useState } from "react"
import {
    RefreshControl,
    FlatList,
    View,
    Animated,
    Switch,
    StyleSheet,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native"

import { Title, Subtitle } from "components/Text"
import { NavBar, NavbarProps } from "components/NavBar"
import { usePalette } from "utils/colors"

import { Article } from "api"

interface PageProps<T> {
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
     * Whether or not to show a toggle switch on the right of the title.
     *
     * If true, provide also the `switchControl` prop
     *
     * @default false
     */
    showSwitch?: boolean
    /**
     * Props for the toggle switch
     */
    switchControl?: {
        /** State of the switch */
        toggled: boolean
        /** Function fired when the state of the switch changes */
        onToggle: (value: boolean) => void
    }
    /**
     * props for the refresh control
     */
    refreshControl?: {
        onRefresh: () => void
        refreshing: boolean
    }

    //TODO: write documentation
    data: T[]
    render: (item: T) => React.ReactElement
    fetchData: () => void

    /**
     * Number from 0 to 1 to control the `onEndReachedThreshold` prop of the flat list
     *
     * @default 0.4
     */
    endThreshold?: number

    children?: React.ReactNode
}

/**
 * General component useful for pages with an infinte scrollable content.
 * It provides a navbar and a flatlist with margin and rounded corners.
 */
export const ScrollPageInfinite: FC<PageProps<Article>> = props => {
    const { background, homeBackground, palette } = usePalette()

    const [isPastTitle, setIsPastTitle] = useState(false)
    const shadowAnim = useRef(new Animated.Value(0)).current

    const navbar = !props.hideNavbar

    const showHeader = props.title !== undefined

    const showSwitch = props.showSwitch ?? false

    const endThreshold = props.endThreshold ?? 0.4

    useEffect(() => {
        // hook called when the shadow needs to be animated
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

    const updatePastTitle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scollThreshold = 20 + (props.scrollOffset || 0)
        if (e.nativeEvent.contentOffset.y >= scollThreshold && !isPastTitle)
            setIsPastTitle(true)
        else if (e.nativeEvent.contentOffset.y < scollThreshold && isPastTitle)
            setIsPastTitle(false)
    }

    return (
        <View style={{ flex: 1, backgroundColor: homeBackground }}>
            {props.backdropElement && (
                // element at the top of the screen, above the page
                <View
                    style={{
                        backgroundColor: homeBackground,
                    }}
                >
                    {props.backdropElement}
                </View>
            )}
            <View
                // wrapper to make the borders of every child rounded
                style={{
                    backgroundColor: background,
                    marginTop: 106 + (props.scrollOffset || 0),
                    flex: 1,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    overflow: "hidden",
                    elevation: 15,
                }}
            >
                <FlatList
                    data={props.data}
                    renderItem={({ item }) => props.render(item)}
                    onEndReached={props.fetchData}
                    onEndReachedThreshold={endThreshold}
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
                    onScroll={showHeader ? e => updatePastTitle(e) : undefined}
                    ListHeaderComponent={
                        showHeader ? (
                            // Sticky page header with the title, subtitle and toggle switch
                            <Animated.View
                                style={[
                                    styles.header,
                                    {
                                        backgroundColor: background,
                                        shadowColor: isPastTitle
                                            ? "#0003"
                                            : undefined,
                                        shadowOpacity: Animated.multiply(
                                            shadowAnim,
                                            0.27
                                        ),
                                        // this creates an unwanted shadow between the title and the content
                                        // elevation: Animated.multiply(shadowAnim, 6),
                                    },
                                ]}
                            >
                                <View style={{ flexDirection: "row" }}>
                                    <View>
                                        <Title>{props.title}</Title>
                                        {props.subtitle && (
                                            <Subtitle>
                                                {props.subtitle}
                                            </Subtitle>
                                        )}
                                    </View>

                                    {showSwitch && (
                                        <Switch
                                            value={props.switchControl?.toggled}
                                            onValueChange={value => {
                                                if (
                                                    props.switchControl
                                                        ?.onToggle
                                                ) {
                                                    props.switchControl.onToggle(
                                                        value
                                                    )
                                                }
                                            }}
                                            trackColor={{
                                                false: homeBackground, // TODO: ask the design team which is the correct color
                                                true: palette.accent,
                                            }}
                                            thumbColor={background}
                                            style={styles.switch}
                                        />
                                    )}
                                </View>
                            </Animated.View>
                        ) : undefined
                    }
                    contentContainerStyle={{
                        backgroundColor: background,
                        paddingTop: !showHeader ? 30 : 0,
                        paddingBottom: 120,
                    }}
                />
            </View>
            {navbar ? <NavBar {...props.navbarOptions} /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        zIndex: 1000,
        paddingHorizontal: 28,
        paddingVertical: 22,
        marginBottom: 16,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 4.65,
    },
    backdrop: {
        zIndex: -1,
        height: 200,
        width: "100%",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    switch: {
        position: "absolute",
        alignSelf: "center",
        right: 5,
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    },
})
