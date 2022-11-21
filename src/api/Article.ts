/* eslint-disable @typescript-eslint/naming-convention */
export interface Articles {
    results: Article[]
}
export interface Article {
    title: string
    subtitle: string
    latitude?: number
    longitude?: number
    publish_time?: string
    target_time?: string
    content?: string
    image?: string
    author?: { name?: string; link?: string; image?: string }
}
