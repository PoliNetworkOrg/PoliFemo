import { useContext } from "react"
import { View } from "react-native"

import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { CardWithGradient } from "components/CardWithGradient"
import { capitalize } from "utils/strings"
import {
  NewsPreferencesContext,
  Preference,
  TagWithData,
} from "contexts/newsPreferences"
import { ScrollPageInfinite } from "components/ScrollPageInfinite"

/**
 * News page containing the articles of a specific tag.
 */
export const OtherCategories: MainStackScreen<"OtherCategories"> = props => {
  const navigation = useNavigation()
  const { preferences } = useContext(NewsPreferencesContext)

  const { tags } = props.route.params

  // Function used when displaying a tag card
  const getTagCard = (tag: TagWithData) => {
    return (
      <CardWithGradient
        key={"__other_categories_tag__" + tag.name}
        title={capitalize(tag.name, 3)}
        imageURL={tag.image}
        onClick={() =>
          navigation.navigate("ArticlesList", {
            tagName: tag.name,
          })
        }
        closerToCorner={true}
        style={{ height: tag.height }}
      />
    )
  }

  const nonFavTags = tags.filter(
    tag => preferences[tag.name] === Preference.UNFAVOURITE
  )
  if (
    nonFavTags.length === 0 &&
    navigation.isFocused() &&
    navigation.canGoBack()
  ) {
    navigation.goBack()
  }

  return (
    <ScrollPageInfinite
      title="Altre categorie"
      items={nonFavTags}
      render={tag => (
        <View style={{ paddingHorizontal: 28 }}>{getTagCard(tag)}</View>
      )}
    />
  )
}
