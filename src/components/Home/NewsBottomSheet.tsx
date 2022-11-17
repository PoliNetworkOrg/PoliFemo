import React, { FC, useEffect, useState, useRef, ReactNode } from "react"
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

export interface NewsCategoriesColumns {
    left: ReactNode[]
    right: ReactNode[]
}

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
    const { isLight, background } = usePalette()

    // modal state
    const [isNewsClosed, setIsNewsClosed] = useState(true)
    // the ref for the News bottom sheet, used to open and close it programmatically
    const bottomSheetRef = useRef<BottomSheet>(null)
    // The reference to the News scrollview, used to scroll it programmatically
    const scrollViewRef = useRef<BottomSheetScrollViewMethods>(null)

    const distanceFromTop = {
        closed: 666,
        opened: 106,
    }

    const testCategories = [
        "Segreteria",
        "Eventi",
        "Gaming",
        "Anime & Manga",
        "Mobilità Internazionale",
        "Polimi Sport",
        "Poli Jobs",
        // "Poli Book",
        // "Fotografia & Videomaking",
        // "Categoria",
        // "Categoria",
    ]

    useEffect(() => {
        // scrolls to the top of the news scrollview when the news bottom sheet is Closed
        if (isNewsClosed && scrollViewRef.current) {
            // "scrollTo" is deprecated but works fine.
            // "scrollToEnd" doesn't work when the news scrollview is fully expanded downwards
            scrollViewRef.current.scrollTo({ y: 0, animated: true })
        }
    }, [isNewsClosed])

    const getColumns = (
        categories: string[],
        offset = 0
    ): NewsCategoriesColumns => {
        if (categories.length === 1) {
            return {
                left: [
                    <CardWithGradient
                        key={0 + offset}
                        title={categories[0]}
                        onClick={() => console.log(categories[0])}
                        style={{ height: 274 }}
                    />,
                ],
                right: [],
            }
        }
        if (categories.length === 2) {
            return {
                left: [
                    <CardWithGradient
                        key={0 + offset}
                        title={categories[0]}
                        onClick={() => console.log(categories[0])}
                        style={{ height: 274 }}
                    />,
                ],
                right: [
                    <CardWithGradient
                        key={1 + offset}
                        title={categories[1]}
                        onClick={() => console.log(categories[1])}
                        style={{ height: 274 }}
                    />,
                ],
            }
        }
        if (categories.length === 3) {
            return {
                left: [
                    <CardWithGradient
                        key={0 + offset}
                        title={categories[0]}
                        onClick={() => console.log(categories[0])}
                        style={{ height: 277 }}
                    />,
                ],
                right: [
                    <CardWithGradient
                        key={1 + offset}
                        title={categories[1]}
                        onClick={() => console.log(categories[1])}
                        style={{ height: 130 }}
                    />,
                    <CardWithGradient
                        key={2 + offset}
                        title={categories[2]}
                        onClick={() => console.log(categories[2])}
                        style={{ height: 130 }}
                    />,
                ],
            }
        }
        if (categories.length === 4) {
            return {
                left: [
                    <CardWithGradient
                        key={0 + offset}
                        title={categories[0]}
                        onClick={() => console.log(categories[0])}
                        style={{ height: 274 }}
                    />,
                    <CardWithGradient
                        key={2 + offset}
                        title={categories[2]}
                        onClick={() => console.log(categories[2])}
                        style={{ height: 130 }}
                    />,
                ],
                right: [
                    <CardWithGradient
                        key={1 + offset}
                        title={categories[1]}
                        onClick={() => console.log(categories[1])}
                        style={{ height: 193 }}
                    />,
                    <CardWithGradient
                        key={3 + offset}
                        title={categories[3]}
                        onClick={() => console.log(categories[3])}
                        style={{ height: 211 }}
                    />,
                ],
            }
        }
        if (categories.length === 5) {
            return {
                left: [
                    <CardWithGradient
                        key={0 + offset}
                        title={categories[0]}
                        onClick={() => console.log(categories[0])}
                        style={{ height: 133 }}
                    />,
                    <CardWithGradient
                        key={2 + offset}
                        title={categories[2]}
                        onClick={() => console.log(categories[2])}
                        style={{ height: 132 }}
                    />,
                    <CardWithGradient
                        key={4 + offset}
                        title={categories[4]}
                        onClick={() => console.log(categories[4])}
                        style={{ height: 132 }}
                    />,
                ],
                right: [
                    <CardWithGradient
                        key={1 + offset}
                        title={categories[1]}
                        onClick={() => console.log(categories[1])}
                        style={{ height: 193 }}
                    />,
                    <CardWithGradient
                        key={3 + offset}
                        title={categories[3]}
                        onClick={() => console.log(categories[3])}
                        style={{ height: 222 }}
                    />,
                ],
            }
        }

        const res: NewsCategoriesColumns = { left: [], right: [] }
        let temp: NewsCategoriesColumns

        temp = getColumns(categories.slice(0, 4), offset)
        res.left = [...res.left, ...temp.left]
        res.right = [...res.right, ...temp.right]

        temp = getColumns(categories.slice(4), offset + 4)
        res.left = [...res.left, ...temp.left]
        res.right = [...res.right, ...temp.right]

        return res
    }

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
                <View style={{ paddingBottom: 110 }}>
                    <CardWithGradient
                        // the news highlight box
                        title={"In Evidenza"}
                        closerToCorner={false}
                        onClick={() => console.log("in evidenza")}
                        style={{ height: 220 }}
                    />
                    <View style={{ flexDirection: "row" }}>
                        <View
                            // left column of news categories
                            style={{ flex: 17, marginRight: 17 }}
                        >
                            {getColumns(testCategories).left}
                        </View>
                        <View
                            // right column of news categories
                            style={{ flex: 14 }}
                        >
                            {getColumns(testCategories).right}
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
