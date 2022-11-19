import React, { FC, useEffect, useState, useRef } from "react"
import { StyleSheet, View } from "react-native"
import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet"

import { NewsCategoriesGrid } from "./NewsCategoriesGrid"
import { Title } from "components/Text"
import { NavBar } from "components/NavBar"
import { usePalette } from "utils/colors"
import { getUsableScreenHeight } from "utils/height"

/**
 * Bottom sheet in the home page to access news highlights and news categories.
 *
 * Its positioning is absolute.
 */
export const NewsBottomSheet: FC = () => {
    const { isLight, background } = usePalette()

    // modal state
    const [isNewsClosed, setIsNewsClosed] = useState(true)
    // the ref for the News bottom sheet, used to open and close it programmatically
    const bottomSheetRef = useRef<BottomSheet>(null)
    // The reference to the News scrollview, used to scroll it programmatically
    const scrollViewRef = useRef<BottomSheetScrollViewMethods>(null)

    // distance of the bottom sheet from the top of the screen, when opened or closed
    const distanceFromTop = {
        closed: 666,
        opened: 106,
    }

    useEffect(() => {
        // scrolls to the top of the news scrollview when the news bottom sheet is Closed
        if (isNewsClosed && scrollViewRef.current) {
            // "scrollTo" is deprecated but works fine.
            // "scrollToEnd" doesn't work when the news scrollview is fully expanded downwards
            scrollViewRef.current.scrollTo({ y: 0, animated: true })
        }
    }, [isNewsClosed])

    return (
        <BottomSheet
            ref={bottomSheetRef}
            handleComponent={() => (
                // "News" title top bar component
                <View style={[styles.topBar, { backgroundColor: background }]}>
                    <View
                        style={[
                            styles.dragBar,
                            {
                                backgroundColor: isLight
                                    ? "rgba(135, 145, 189, 0.5)"
                                    : "#424967",
                            },
                        ]}
                    />
                    <Title>News</Title>
                </View>
            )}
            style={[styles.bottomSheet, { backgroundColor: background }]}
            backgroundStyle={{
                backgroundColor: background,
                // Not 30 borderRadius because on IOS on dark mode there where white borders
                borderTopLeftRadius: 33,
                borderTopRightRadius: 33,
            }}
            onChange={index => {
                // fires when the bottom sheet changes position index, keeps track of when the sheet is open/close
                setIsNewsClosed(index === 0)
            }}
            index={isNewsClosed ? 0 : 1}
            snapPoints={[
                // 0 is at the bottom of the screen
                getUsableScreenHeight() - distanceFromTop.closed,
                getUsableScreenHeight() - distanceFromTop.opened,
            ]}
            animateOnMount={false} // app should begin stationary
        >
            <BottomSheetScrollView
                ref={scrollViewRef}
                style={{
                    paddingHorizontal: 26,
                    backgroundColor: background,
                }}
            >
                <NewsCategoriesGrid />
            </BottomSheetScrollView>
            <NavBar
                // TODO: ask the design team if we need to use the navbar here
                overrideBackBehavior={() => setIsNewsClosed(true)}
                overrideHomeBehavior={() => setIsNewsClosed(true)}
            />
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    bottomSheet: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 20,
    },
    topBar: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 26,
        height: 112,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    dragBar: {
        alignSelf: "center",
        width: 120,
        height: 5,
        borderRadius: 4,
    },
})
