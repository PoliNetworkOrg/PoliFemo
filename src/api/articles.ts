/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, RequestOptions } from "./HttpClient"

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
  title: string
  subtitle?: string
  latitude?: number
  longitude?: number
  publish_time: string
  target_time?: string
  content: string
  image?: string
  author?: { name?: string; link?: string; image?: string }
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
   *      .catch(err => logger(err))
   * }
   * ```
   */
  async getFromOffsetByTag(
    tag: string,
    limit: number,
    offset: number,
    options?: RequestOptions
  ) {
    const response = await client.poliNetworkInstance.get<Articles>(
      "/v1/articles",
      {
        ...options,
        params: {
          limit: limit,
          pageOffset: offset,
          tag: tag,
          sort: "date",
        },
      }
    )
    return response.data.articles
  },

  /**
   * Retrieves the last article of a given tag from PoliNetwork server.
   *
   * @param tag the news category
   *
   * @param options see {@link RequestOptions}
   */
  async getLastArticleByTag(tag: string, options?: RequestOptions) {
    const response = await client.poliNetworkInstance.get<Articles>(
      "/v1/articles",
      {
        ...options,
        params: { tag: tag, limit: 1, sort: "date" },
      }
    )
    return response.data.articles[0]
  },
}
