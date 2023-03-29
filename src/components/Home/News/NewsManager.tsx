import { useContext, useEffect, useState } from "react"

import { api } from "api"
import { Article, Tag } from "api/collections/articles"
import {
  TagWithData,
  NewsPreferencesContext,
  Preference,
} from "contexts/newsPreferences"
import { NewsBottomSheet } from "./NewsBottomSheet"
import { newsTagsPatterns, CardsPattern } from "utils/cardsPatterns"

/**
 * Bottom sheet in the home page to access the news.
 *
 * This is the component that retrieves and precesses the news content.
 * Afterwards, it passes the data to the NewsBottomSheet.
 */
export const NewsManager = () => {
  const [tags, setTags] = useState<Tag[]>([])

  const { preferences } = useContext(NewsPreferencesContext)

  // Object to store the last article of each tag
  const [lastArticles, setLastArticles] = useState<
    Record<Tag["name"], Article>
  >({})

  // Download the last published article of each tag (news category) in parallel
  // and wait until each one has finished
  const getLastArticles = async (tags: Tag[]) => {
    const tempArticles = {} as typeof lastArticles
    const promises = []
    for (const tag of tags) {
      promises.push(
        api.articles
          .getLastArticleByTag({ tag: tag.name })
          .then(article => {
            tempArticles[tag.name] = article
          })
          .catch(err => {
            console.log(err)
          })
      )
    }
    await Promise.allSettled(promises)
    return tempArticles
  }

  useEffect(() => {
    // Load tags (news categories) and their last article (one for each tag)
    const fetchData = async () => {
      const responseTags = await api.tags.getTags()
      const responseArticles = await getLastArticles(responseTags)
      setTags(responseTags)
      setLastArticles(responseArticles)
    }
    fetchData().catch(err => console.log(err))
  }, [])

  // Function that calculates heights and columns of tag cards using hardcoded patterns.
  // Then it returns a new list of tags with that and other usefull data.
  const getTagsWithData = () => {
    const tempTagsWithData: TagWithData[] = []

    // store the pattern data of the current batch of cards
    let pattern: CardsPattern
    // index of the current news tag
    let index = 0
    // number of tags remaining
    let remaining = tags.length

    while (index < tags.length) {
      // choose the dimension of the next batch of tags and get the corresponding pattern
      if (index === 0) {
        // When first bacth
        if (remaining <= 6) {
          pattern = newsTagsPatterns.first[remaining]
        } else {
          pattern = newsTagsPatterns.first[4]
        }
      } else {
        // When other batches. Here it is never possible that remaining === 1 or remaining === 2
        if (remaining % 5 === 1 || remaining % 5 === 3) {
          pattern = newsTagsPatterns.other[3]
        } else if (remaining % 5 === 2 || remaining % 5 === 4) {
          pattern = newsTagsPatterns.other[4]
        } else {
          pattern = newsTagsPatterns.other[5]
        }
      }

      for (const [height, column] of pattern) {
        tempTagsWithData.push({
          ...tags[index],
          column: column,
          height: height,
          favourite: preferences[tags[index].name] !== Preference.UNFAVOURITE,
        })
        index++
        remaining--
      }
    }
    return tempTagsWithData
  }

  const getHighlightedArticle = () => {
    const favouriteTags = tags.filter(
      tag => preferences[tag.name] !== Preference.UNFAVOURITE
    )
    // If there are no favourite tags, choose the highlighted article from all the other tags
    const tagsToAnalyze = favouriteTags.length > 0 ? favouriteTags : tags
    let tempHighlighted: Article | undefined = undefined

    for (const tag of tagsToAnalyze) {
      if (!tempHighlighted) {
        tempHighlighted = lastArticles[tag.name]
      } else {
        const article = lastArticles[tag.name]
        const articleDate = new Date(article?.publish_time)
        const highlightedDate = new Date(tempHighlighted.publish_time)
        if (articleDate > highlightedDate) {
          tempHighlighted = article
        }
      }
    }
    return tempHighlighted
  }

  return (
    <NewsBottomSheet
      tags={getTagsWithData()}
      highlightedArticle={getHighlightedArticle()}
    />
  )
}
