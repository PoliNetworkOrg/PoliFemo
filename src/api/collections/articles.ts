/* eslint-disable @typescript-eslint/naming-convention */
import { mapAxiosRequest } from "api/mapAxiosRequest"
import { ApiCollection } from "api/useApiCall"
import { HttpClient, RequestOptions } from "../HttpClient"

export interface Tags {
  tags: Tag[]
}

export interface Tag {
  name: string
  image: string
}

export interface Articles {
  articles: Article[]
  start: string | null
  end: string | null
  tag: string | null
  author_id: number | null
  title: string | null
}
export interface Article {
  id: number
  tag_id: string
  latitude?: number
  longitude?: number
  publish_time: string
  target_time?: string
  hidden_until?: string
  content: {
    it: ArticlesParams
    en: ArticlesParams
  }
  image?: string
  blurhash?: string
  author?: { name?: string; link?: string; image?: string }
}

interface ArticlesParams {
  content: string
  title: string
  subtitle: string
  url: string
}

const client = HttpClient.getInstance()

function getArticles({
  tag,
  limit,
  pageOffset,
  options,
}: {
  tag: string
  limit: number
  pageOffset?: number
  options?: RequestOptions
}) {
  const request = client.callPoliNetwork<Articles>({
    url: "/v1/articles",
    method: "GET",
    params: { tag, limit, sort: "date", platform: 1, pageOffset: pageOffset },
    ...options,
  })
  return mapAxiosRequest(request, res => res.articles[0])
}

/**
 * Collection of endpoints related to Articles.
 */
export const articles = {
  /**
   * Retrieves at most `limit` articles of a given tag from PoliNetwork server.
   *
   * If offset is `0` the newest `limit` articles are returned;
   * if offset is `1` the next `limit` articles are returned, and so on.
   *
   * In the last group there might be less than `limit` articles.
   *
   * @param tag the news category
   * @param limit maximum number of articles retrieved
   * @param offset the page offset parameter
   *
   * @param options see {@link RequestOptions}
   *
   * @example
   * ```ts
   *  api.articles.getFromOffsetByTag("TAG", 10, 2)
   *     .then(response => {
   *          const articles: Article[] = response
   *          //do something
   *      })
   *      .catch(err => console.log(err))
   * }
   * ```
   */
  getFromOffsetByTag(
    params: { tag: string; limit: number; offset: number },
    options?: RequestOptions
  ) {
    return getArticles({
      limit: params.limit,
      tag: params.tag,
      pageOffset: params.offset,
      options: options,
    })
  },

  /**
   * Retrieves the last article of a given tag from PoliNetwork server.
   *
   * @param tag the news category
   *
   * @param options see {@link RequestOptions}
   */
  getLastArticleByTag(params: { tag: string }, options?: RequestOptions) {
    return getArticles({ limit: 1, tag: params.tag, options, pageOffset: 1 })
  },

  /**
   * Retrieves Tags (news categories) from PoliNetwork server.
   */
  getTags(_params?: Record<string, unknown>, options?: RequestOptions) {
    const request = client.callPoliNetwork<Tags>({
      url: "/v1/tags",
      method: "GET",
      ...options,
    })

    return mapAxiosRequest(request, res => res.tags)
  },
} satisfies ApiCollection
