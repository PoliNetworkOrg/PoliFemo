import React, { FC, useEffect, useState, useRef } from "react"
import { StyleSheet, View } from "react-native"
import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet"

import { Title } from "components/Text"
import { CardWithGradient } from "components/CardWithGradient"
import { NavBar } from "components/NavBar"
import { usePalette } from "utils/colors"
import { getUsableScreenHeight } from "utils/height"

/**
 * Bottom sheet in the home page to access news highlights and news categories.
 *
 *
 * Promemoria gestione dimensione boxes:
 *
 * CASI BASE:
 * 1 categoria -> 1 box alto un po' di meno di quello "in evidenza"
 * 2 categorie -> 2 box alti uguali uno di fianco all'altro
 * 3 categorie -> 2 box alti uguali affianco ad 1 box alto come la loro somma
 * 4 categorie -> pattern dei primi 4 su figma
 * 5 categorie -> pattern dei secondi 4 su figma
 *
 * CASI "RICORSIVI":
 * 6 categorie -> 3 + 3 (oppure ideare un pattern custom)
 * 7 categorie -> 3 + 4
 * 8 categorie -> 4 + 4
 * 9 categorie -> 4 + 5
 * 10 categorie -> 5 + 5
 *
 * e così via...
 */
export const NewsBottomSheet: FC = () => {
    const { background } = usePalette()

    // modal state
    const [isNewsClosed, setIsNewsClosed] = useState(true)
    // the ref for the News bottom sheet, used to open and close it programmatically
    const bottomSheetRef = useRef<BottomSheet>(null)
    // The reference to the News scrollview, used to scroll it programmatically
    const scrollViewRef = useRef<BottomSheetScrollViewMethods>(null)

    const distanceFromTop = {
        closed: 430,
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

    // TODO: change with correct titles and heights
    const boxes = [1, 2, 3, 4, 5].map(num => {
        const category = "Category " + String(num)
        return (
            <CardWithGradient
                key={num}
                title={category}
                onClick={() => console.log(category)}
                style={{ height: num * 50 }}
            />
        )
    })

    return (
        <BottomSheet
            ref={bottomSheetRef}
            handleComponent={() => (
                // "News" title top bar component
                <View style={[styles.topBar, { backgroundColor: background }]}>
                    <Title>News</Title>
                </View>
            )}
            style={[styles.bottomSheet, { backgroundColor: background }]}
            backgroundStyle={{
                backgroundColor: background,
                // rounds the top corners the same as the rest of the app
                // TODO: test on ios. Vedere se lo posso levare
                borderTopLeftRadius: 33,
                borderTopRightRadius: 33,
            }}
            onAnimate={fromIndex => {
                // fires when the bottom sheet is animating, keeps track of when the sheet is open/close
                setIsNewsClosed(fromIndex === 1)
            }}
            onChange={index => {
                // fires when the bottom changes position index
                // keeps track of when the sheet is open/close if the user scrolls all the way to the top (onAnimate fails)
                if ((index === 0) != isNewsClosed) {
                    setIsNewsClosed(index === 0)
                }
            }}
            index={isNewsClosed ? 0 : 1} // the position depends on if Open or open
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
                <View
                    style={{
                        paddingBottom: 110,
                    }}
                >
                    <CardWithGradient
                        // the news highlight box
                        title={"In Evidenza"}
                        closerToCorner={false}
                        onClick={() => console.log("in evidenza")}
                        style={{ height: 220 }}
                    />
                    <View style={{ flexDirection: "row" }}>
                        <View
                            // left column of news category boxes
                            style={{ flex: 1, marginRight: 17 }}
                        >
                            {boxes}
                        </View>
                        <View
                            // right column of news category boxes
                            style={{ flex: 1 }}
                        >
                            {boxes}
                        </View>
                    </View>
                </View>
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

        // IOS shadow above "News" title
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,

        // Android shadow above "News" title
        elevation: 15,
    },
    topBar: {
        flex: 1,
        flexDirection: "row",
        // alignItems: "baseline",
        paddingHorizontal: 26,
        paddingBottom: 20,
        paddingTop: 38,
        height: 56 + 38 + 20, // content height + paddingTop + paddingBottom
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
})
