import { FC, useEffect, useState, useRef, useContext } from "react"
import { StyleSheet, View } from "react-native"
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet"

import { Article } from "api/articles"
import {
  NewsPreferencesContext,
  Preference,
  TagWithData,
} from "contexts/newsPreferences"
import { NewsTagsGrid } from "./NewsTagsGrid"
import { CardWithGradient } from "components/CardWithGradient"
import { NavBar } from "components/NavBar"
import { usePalette } from "utils/colors"
import { useNavigation } from "navigation/NavigationTypes"
import { getUsableScreenHeight } from "utils/layout"
import { newsSheetEventEmitter } from "utils/events"
import { NewsBottomSheetHandle } from "./NewsBottomSheetHandle"

interface NewsBottomSheetProps {
  /**
   * Tags (news categories) in the favourite section
   */
  tags: TagWithData[]
  /**
   * Article at the top of the news section
   */
  highlightedArticle?: Article
}

/**
 * Bottom sheet in the home page to access the news.
 *
 * This component receives data from the NewsManager and handles the graphic part.
 * Its positioning is absolute.
 */
export const NewsBottomSheet: FC<NewsBottomSheetProps> = props => {
  const navigation = useNavigation()
  const { background } = usePalette()

  const { preferences } = useContext(NewsPreferencesContext)

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

  const showHighlighted = props.highlightedArticle !== undefined
  const showButtonToOtherTags = Object.values(preferences).some(
    p => p === Preference.UNFAVOURITE
  )

  const favTags = props.tags.filter(
    tag => preferences[tag.name] !== Preference.UNFAVOURITE
  )

  useEffect(() => {
    // scrolls to the top of the news scrollview
    if (isNewsClosed && scrollViewRef.current) {
      // "scrollTo" is deprecated but works fine.
      // "scrollToEnd" doesn't work when the news scrollview is fully expanded downwards
      scrollViewRef.current.scrollTo({ y: 0, animated: false })
    }
  }, [isNewsClosed])

  useEffect(() => {
    // dispatch news sheet event
    newsSheetEventEmitter.emit("state_change", !isNewsClosed)
  }, [isNewsClosed])

  useEffect(() => {
    // Set up the event listener to close the NewsBottomSheet
    // when the home button in the NavBar is clicked
    const listener = newsSheetEventEmitter.addListener("should_close", () => {
      setIsNewsClosed(true)
    })
    return () => listener.remove?.()
  }, [])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      handleComponent={NewsBottomSheetHandle}
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
      index={isNewsClosed ? 0 : 1} // close = 0 and open = 1
      snapPoints={[
        // 0 is at the bottom of the screen
        Math.max(getUsableScreenHeight() - distanceFromTop.closed, 42),
        getUsableScreenHeight() - distanceFromTop.opened,
      ]}
      animateOnMount={false} // app should begin stationary
    >
      <BottomSheetScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 26,
          backgroundColor: background,
          paddingTop: 16,
        }}
      >
        {showHighlighted && (
          <CardWithGradient
            title={"In Evidenza"}
            imageURL={
              props.highlightedArticle?.image &&
              props.highlightedArticle.image.length > 0
                ? props.highlightedArticle.image
                : ""
              // : "http://rl.airlab.deib.polimi.it/wp-content/uploads/2022/06/1-PolimiCampus_2.jpg"
            }
            onClick={() =>
              navigation.navigate("Article", {
                article: props.highlightedArticle as Article,
              })
            }
            style={{ height: 220, marginBottom: 34 }}
            articleTitle={props.highlightedArticle?.title}
          />
        )}

        <NewsTagsGrid tags={favTags} />

        {showButtonToOtherTags && (
          <CardWithGradient
            title={"Altre Categorie"}
            onClick={() =>
              navigation.navigate("OtherCategories", {
                tags: props.tags,
              })
            }
            style={{ height: 80, marginTop: 17 }}
          />
        )}

        <View
          // So that the scrollable content does not remain behind the NavBar
          style={{ height: 120 }}
        />
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
  },
})
