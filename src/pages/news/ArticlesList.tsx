import { useState, useEffect, useRef, useContext } from "react"
import { View } from "react-native"

import { api, RetryType } from "api"
import { Article } from "api/collections/articles"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { ScrollPageInfinite } from "components/Home/News/ScrollPageInfinite"
import { CardWithGradient } from "components/CardWithGradient"
import { capitalize } from "utils/functions"
import { NewsPreferencesContext, Preference } from "contexts/newsPreferences"
import { useCurrentLanguage } from "utils/articles"

const MAX_ARTICLES_PER_REQUEST = 8

/**
 * News page containing the articles of a specific tag.
 */
export const ArticlesList: MainStackScreen<"ArticlesList"> = props => {
  const navigation = useNavigation()
  const { preferences, setArticlesPreferences } = useContext(
    NewsPreferencesContext
  )
  const { tagName } = props.route.params

  const [articles, setArticles] = useState<Article[]>([])
  const [toggled, setToggled] = useState<boolean>(
    preferences[tagName] !== Preference.UNFAVOURITE
  )

  const [refresh, setRefresh] = useState<boolean>(false)
  const [isFetching, setIsFetching] = useState<boolean>(true)

  const offset = useRef<number>(0)

  const fetchArticles = async (keepArticles: boolean) => {
    try {
      const response = await api.articles.getFromOffsetByTag(
        {
          tag: tagName,
          limit: MAX_ARTICLES_PER_REQUEST,
          offset: offset.current,
        },
        { retryType: RetryType.NO_RETRY }
      )
      if (keepArticles) {
        // Keep previously downloaded articles
        setArticles([...articles, ...response])
      } else {
        // Overwrite previously downloaded articles
        setArticles(response)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchArticles(false).finally(() => {
      // Increase the offset so that at the following fetch you get the next articles
      offset.current += 1
      setIsFetching(false)
    })
  }, [])

  const currentLanguage = useCurrentLanguage()

  return (
    <ScrollPageInfinite
      title={capitalize(tagName, 3)}
      items={articles}
      render={article => (
        <View style={{ paddingHorizontal: 28 }}>
          <CardWithGradient
            key={article.id}
            title={
              currentLanguage === "it"
                ? article.content.it.title
                : article.content.en.title
            }
            imageURL={article.image}
            onClick={() =>
              navigation.navigate("Article", {
                article: article,
              })
            }
            style={{ height: 220, marginBottom: 13 }}
          />
        </View>
      )}
      fetchControl={{
        fetching: isFetching,
        onFetch: () => {
          if (!refresh && !isFetching) {
            setIsFetching(true)
            fetchArticles(true).finally(() => {
              offset.current += 1
              setIsFetching(false)
            })
          }
        },
      }}
      refreshControl={{
        refreshing: refresh,
        onRefresh: () => {
          if (!refresh && !isFetching) {
            setRefresh(true)
            offset.current = 0
            fetchArticles(false).finally(() => {
              offset.current += 1
              setRefresh(false)
            })
          }
        },
      }}
      showSwitch={true}
      switchControl={{
        toggled: toggled,
        onToggle: value => {
          setToggled(value)
          const newFavorites = { ...preferences }
          if (value) newFavorites[tagName] = Preference.FAVOURITE
          else newFavorites[tagName] = Preference.UNFAVOURITE
          setArticlesPreferences({ preferences: newFavorites })
        },
      }}
    />
  )
}
