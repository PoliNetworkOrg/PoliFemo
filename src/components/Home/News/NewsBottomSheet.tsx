import React, { FC, useEffect, useState, useRef } from "react"
import { StyleSheet, View } from "react-native"
import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet"

import { Article } from "api"
import { TagWithData } from "./NewsManager"
import { NewsTagsGrid } from "./NewsTagsGrid"
import { Title } from "components/Text"
import { CardWithGradient } from "components/CardWithGradient"
import { NavBar } from "components/NavBar"
import { usePalette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"
import { getUsableScreenHeight } from "utils/height"

interface NewsBottomSheetProps {
    /**
     * Tags (news categories) in the favourite section
     */
    favouriteTags: TagWithData[]
    /**
     * All the other tags (new categories), at the bottom of the news section
     */
    otherTags: TagWithData[]
    /**
     * Article at the top of the news section
     */
    highlightArticle: Article
    /**
     * Callback function used to update the state in the NewsManager when the preference
     * of a tag changes (whether it is favourite or not)
     */
    updateFavourites: (tagName: string, favourite: boolean) => void
}

/**
 * Bottom sheet in the home page to access the news.
 *
 * This component receives data from the NewsManager and handles the graphic part.
 * Its positioning is absolute.
 */
export const NewsBottomSheet: FC<NewsBottomSheetProps> = props => {
    const navigation = useNavigation()
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

    //TODO: vedere se levare barra di scorrimento laterale
    return (
        <BottomSheet
            ref={bottomSheetRef}
            handleComponent={() => (
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
            )}
            style={[styles.bottomSheet, { backgroundColor: background }]}
            backgroundStyle={{
                backgroundColor: background,
                // Not 30 borderRadius because on IOS on dark mode there where white borders
                borderTopLeftRadius: 33,
                borderTopRightRadius: 33,
            }}
            onAnimate={fromIndex => {
                // fires when the bottom sheet changes position index, keeps track of when the sheet is open/close.
                // More responsive than onChange
                setIsNewsClosed(fromIndex === 1)
            }}
            onChange={index => {
                // fires when the bottom sheet changes position index, keeps track of when the sheet is open/close.
                // In certain cases, onAnimate fails
                setIsNewsClosed(index === 0)
            }}
            index={isNewsClosed ? 0 : 1}
            snapPoints={[
                // 0 is at the bottom of the screen
                Math.max(getUsableScreenHeight() - distanceFromTop.closed, 42),
                getUsableScreenHeight() - distanceFromTop.opened,
            ]}
            animateOnMount={false} // app should begin stationary
        >
            <BottomSheetScrollView
                ref={scrollViewRef}
                stickyHeaderIndices={[0, 3]}
                style={{
                    paddingHorizontal: 26,
                    backgroundColor: background,
                }}
            >
                <View style={[styles.topBar, { backgroundColor: background }]}>
                    <Title
                        style={{ fontFamily: "Roboto_700Bold", fontSize: 48 }}
                    >
                        News
                    </Title>
                </View>

                {props.highlightArticle && (
                    <CardWithGradient
                        title={"In Evidenza"}
                        imageURL={props.highlightArticle.image}
                        onClick={() =>
                            navigation.navigate("Article", {
                                article: props.highlightArticle,
                            })
                        }
                        style={{ height: 220 }}
                    />
                )}

                <NewsTagsGrid
                    tags={props.favouriteTags}
                    updateFavourites={props.updateFavourites}
                />

                {props.otherTags.length > 0 && (
                    <View
                        style={[styles.topBar, { backgroundColor: background }]}
                    >
                        <Title
                            style={{
                                fontFamily: "Roboto_700Bold",
                                fontSize: 42,
                            }}
                        >
                            Altre Categorie
                        </Title>
                    </View>
                )}

                <NewsTagsGrid
                    tags={props.otherTags}
                    updateFavourites={props.updateFavourites}
                />

                <View
                    // So that the scrollable content does not remain behind the NavBar
                    style={{ height: 120 }}
                ></View>
            </BottomSheetScrollView>
            <NavBar
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
        marginBottom: 16,
    },
    dragBar: {
        alignSelf: "center",
        width: 120,
        height: 5,
        marginVertical: 16,
        borderRadius: 4,
    },
})
