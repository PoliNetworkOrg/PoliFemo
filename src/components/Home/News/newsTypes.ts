import { Tag, Article } from "api"

/** Enum to represent whether a tag is favourite or not */
export enum Preference {
    OTHER,
    FAVOURITE,
}

export type TagWithData = Tag & {
    /** The column in which the card has to be inserted */
    column: "left" | "right"
    /** The height of the card */
    height: number
    /** Whether the tag is favourite or not */
    preference: Preference
}

/**
 * Interface of an object that maps a tag name to its preference
 *
 * TODO: use tag id if and when there will be one
 */
export interface Preferences {
    [key: string]: Preference
}

/**
 * Interface of an object that maps a tag name to an article.
 *
 * TODO: use tag id if and when there will be one
 */
export interface LastArticles {
    [key: string]: Article
}

/**
 * Interface for the arguments of the function that is called
 * when the `update-preference` event is fired.
 */
export interface UpdatePreferenceEventArgs {
    tagName: string
    preference: Preference
}
