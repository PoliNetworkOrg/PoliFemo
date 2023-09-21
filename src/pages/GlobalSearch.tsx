import React from "react"
import { View, StyleSheet } from "react-native"

import { MainStackScreen } from "navigation/NavigationTypes"
import { ListPage } from "components/PageLayout"
import { PoliSearchBar } from "components/PoliSearchBar"
import { SearchTagFilter } from "components/GlobalSearch/SearchTagFilter"
import { SearchTile } from "components/GlobalSearch/SearchTile"
import { SearchTag, SEARCH_TAGS, SEARCH_TAG_TO_LABEL } from "utils/search"

export const GlobalSearch: MainStackScreen<"GlobalSearch"> = () => {
  const [selectedTag, setSelectedTag] = React.useState<SearchTag | null>(null)
  const [input, setInput] = React.useState("")

  // temporary result
  const resultData = [
    {
      tag: "news" as const,
      title: "Titolo News",
      subtitle: "Questo e un risultato di ricerca",
      key: 0,
    },
    {
      tag: "sections" as const,
      title: "Titolo sezione",
      subtitle: "Questo e un risultato di ricerca",
      key: 1,
    },
    {
      tag: "notifications" as const,
      title: "Titolo notifica",
      subtitle: "Questo e un risultato di ricerca",
      key: 2,
    },
    {
      tag: "materials" as const,
      title: "Titolo materiali",
      subtitle: "Questo e un risultato di ricerca",
      key: 3,
    },
    {
      tag: "news" as const,
      title: "Titolo News",
      subtitle: "Questo e un risultato di ricerca",
      key: 4,
    },
    {
      tag: "sections" as const,
      title: "Titolo sezione",
      subtitle: "Questo e un risultato di ricerca",
      key: 5,
    },
    {
      tag: "notifications" as const,
      title: "Titolo notifica",
      subtitle: "Questo e un risultato di ricerca",
      key: 6,
    },
    {
      tag: "materials" as const,
      title: "Titolo materiali",
      subtitle: "Questo e un risultato di ricerca",
      key: 7,
    },
    {
      tag: "news" as const,
      title: "Titolo News",
      subtitle: "Questo e un risultato di ricerca",
      key: 8,
    },
    {
      tag: "sections" as const,
      title: "Titolo sezione",
      subtitle: "Questo e un risultato di ricerca",
      key: 9,
    },
    {
      tag: "notifications" as const,
      title: "Titolo notifica",
      subtitle: "Questo e un risultato di ricerca",
      key: 10,
    },
    {
      tag: "materials" as const,
      title: "Titolo materiali",
      subtitle: "Questo e un risultato di ricerca",
      key: 11,
    },
  ]

  return (
    <ListPage
      headerComponent={
        <>
          <PoliSearchBar
            style={styles.searchBar}
            onChange={input => setInput(input)}
            autoFocus
          />
          <View style={styles.tagsContainer}>
            {SEARCH_TAGS.map(tag => (
              <View style={styles.tag} key={tag}>
                <SearchTagFilter
                  tag={tag}
                  title={SEARCH_TAG_TO_LABEL[tag]}
                  onClick={() =>
                    tag === selectedTag
                      ? setSelectedTag(null)
                      : setSelectedTag(tag)
                  }
                  isSelected={tag === selectedTag}
                />
              </View>
            ))}
          </View>
        </>
      }
      data={
        input
          ? resultData.filter(
              result => !selectedTag || result.tag === selectedTag
            )
          : []
      }
      renderItem={({ item }) => (
        <SearchTile
          key={item.key}
          tag={item.tag}
          title={item.title}
          subtitle={item.subtitle}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 0,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
  tag: {
    width: "50%",
    minWidth: 130,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
})
