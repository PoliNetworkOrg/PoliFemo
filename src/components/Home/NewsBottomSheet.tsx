import React, { FC, useEffect, useState, useRef } from "react"
import { StyleSheet, View } from "react-native"
import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { api, RetryType, Tag, Article } from "api"
import { NewsTagsGrid } from "./NewsTagsGrid"
import { Title } from "components/Text"
import { NavBar } from "components/NavBar"
import { usePalette } from "utils/colors"
import { getUsableScreenHeight } from "utils/height"

export interface Favourites {
    [key: string]: boolean
}
export interface LastArticles {
    [key: string]: Article
}

/**
 * Bottom sheet in the home page to access news.
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

    // Store the list of news tags
    const [tags, setTags] = useState<Tag[]>([])
    // Store wether a tag is marked as favourite or not
    const [favourites, setFavourites] = useState<Favourites>({})
    // Store the last article of each tag
    const [lastArticles, setLastArticles] = useState<LastArticles>({})

    const getLastArticles = async (list: Tag[]) => {
        const tempLastArticles: LastArticles = {}
        for (const tag of list) {
            const article = await api.getLastArticlByTag(tag.name, {
                retryType: RetryType.NO_RETRY,
            })
            tempLastArticles[tag.name] = article
        }
        return tempLastArticles
    }

    useEffect(() => {
        // Load tags (news categories) and their last article (one for each tag)
        const fetchData = async () => {
            const tempTags = await api.getTags()
            const tempLastArticles = await getLastArticles(tempTags)
            setTags(tempTags)
            setLastArticles(tempLastArticles)
        }
        fetchData().catch(err => console.log(err))
    }, [])

    useEffect(() => {
        console.log("Loading favourite tags from storage")
        AsyncStorage.getItem("newstags:favourite")
            .then(favouritesJSON => {
                if (favouritesJSON) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const data: Favourites = JSON.parse(favouritesJSON)
                    setFavourites(data)
                }
            })
            .catch(err => console.log(err))
    }, [])

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
            // handleComponent={() => (
            //     // "News" title top bar component
            //     <View style={[styles.topBar, { backgroundColor: background }]}>
            //         <View
            //             style={[
            //                 styles.dragBar,
            //                 {
            //                     backgroundColor: isLight
            //                         ? "rgba(135, 145, 189, 0.5)"
            //                         : "#424967",
            //                 },
            //             ]}
            //         />
            //         <Title
            //             style={{ fontFamily: "Roboto_700Bold", fontSize: 48 }}
            //         >
            //             News
            //         </Title>
            //     </View>
            // )}
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
                style={{
                    paddingHorizontal: 26,
                    backgroundColor: background,
                }}
                stickyHeaderIndices={[0, 2]}
            >
                <View style={[styles.topBar, { backgroundColor: background }]}>
                    <Title
                        style={{ fontFamily: "Roboto_700Bold", fontSize: 48 }}
                    >
                        News
                    </Title>
                </View>
                <NewsTagsGrid
                    tags={tags}
                    favourites={favourites}
                    lastArticles={lastArticles}
                    updateFavourites={(categoryName, favourite) => {
                        const tempFavourites = { ...favourites }
                        tempFavourites[categoryName] = favourite
                        setFavourites(tempFavourites)
                    }}
                />
                <View style={[styles.topBar, { backgroundColor: background }]}>
                    <Title
                        style={{ fontFamily: "Roboto_700Bold", fontSize: 48 }}
                    >
                        Altre Categorie
                    </Title>
                </View>
                <NewsTagsGrid
                    tags={tags}
                    favourites={favourites}
                    lastArticles={lastArticles}
                    updateFavourites={(categoryName, favourite) => {
                        const tempFavourites = { ...favourites }
                        tempFavourites[categoryName] = favourite
                        setFavourites(tempFavourites)
                    }}
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
    // topBar: {
    //     flex: 1,
    //     justifyContent: "center",
    //     paddingHorizontal: 26,
    //     height: 112,
    //     borderTopLeftRadius: 30,
    //     borderTopRightRadius: 30,
    // },
    topBar: {
        flex: 1,
        justifyContent: "center",
        height: 80,
    },
    dragBar: {
        alignSelf: "center",
        width: 120,
        height: 5,
        borderRadius: 4,
    },
})
