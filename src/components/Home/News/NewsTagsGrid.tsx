import React, { FC } from "react"
import { View } from "react-native"

import { TagWithData } from "contexts/newsPreferences"
import { CardWithGradient } from "components/CardWithGradient"
import { useNavigation } from "navigation/NavigationTypes"
import { capitalize } from "utils/strings"

interface NewsTagsGridProps {
  /**
   * Tags to be displayed
   */
  tags: TagWithData[]
}

/**
 * Component used to display a grid containing the tags (news categories)
 * inside of the news bottom sheet in the home page.
 */
export const NewsTagsGrid: FC<NewsTagsGridProps> = props => {
  const navigation = useNavigation()

  // Function used when displaying a tag card
  const getTagCard = (tag: TagWithData) => {
    return (
      <CardWithGradient
        key={tag.name}
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

  return (
    <>
      {props.tags.length === 1 ? (
        // if there is only 1 news tag, display its card at full width
        getTagCard(props.tags[0])
      ) : (
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 17, marginRight: 17 }}>
            {props.tags
              .filter(tag => tag.column === "left")
              .map(tag => getTagCard(tag))}
          </View>

          <View style={{ flex: 14 }}>
            {props.tags
              .filter(tag => tag.column === "right")
              .map(tag => getTagCard(tag))}
          </View>
        </View>
      )}
    </>
  )
}
