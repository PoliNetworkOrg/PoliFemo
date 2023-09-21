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
  blurhash: string
}

export interface Articles {
  articles: Article[]
  start: string | null
  end: string | null
  tag: string | null
  author_id: number | null
  title: string | null
}
interface ArticleAuthor {
  name?: string
  link?: string
  image?: string
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
    it?: ArticleParams
    en?: ArticleParams
  }
  image?: string
  blurhash?: string
  author?: ArticleAuthor
}

interface ArticleParams {
  content: string
  title: string
  subtitle: string
  url: string
}

const client = HttpClient.getInstance()

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
    const request = client.callPoliNetwork<Articles>({
      url: "/v1/articles",
      method: "GET",
      params: {
        platform: 1,
        limit: params.limit,
        pageOffset: params.offset,
        tag: params.tag,
        sort: "date",
      },
      ...options,
    })
    return mapAxiosRequest(request, res => res.articles)
  },

  /**
   * Retrieves the last article of a given tag from PoliNetwork server.
   *
   * @param tag the news category
   *
   * @param options see {@link RequestOptions}
   */
  getLastArticleByTag(params: { tag: string }, options?: RequestOptions) {
    const request = client.callPoliNetwork<Articles>({
      url: "/v1/articles",
      method: "GET",
      params: { tag: params.tag, limit: 1, sort: "date", platform: 1 },
      ...options,
    })
    return mapAxiosRequest(request, res => res.articles[0])
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
